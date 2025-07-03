import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to validate price ID against configuration
function validatePriceId(priceId) {
  if (!priceId || typeof priceId !== 'string') {
    return null;
  }
  
  // Check monthly plans
  const monthlyPlan = configFile.stripe.plans.find((p) => p.priceId === priceId);
  if (monthlyPlan) return monthlyPlan;
  
  // Check annual plans
  const annualPlan = configFile.stripe.plans_annual.find((p) => p.priceId === priceId);
  if (annualPlan) return annualPlan;
  
  // Check scale plans (both monthly and annual)
  const scalePlan = configFile.stripe.plans.find(p => p.isSlider);
  if (scalePlan && scalePlan.tiers) {
    const scaleTier = scalePlan.tiers.find(tier => tier.priceId === priceId);
    if (scaleTier) return { ...scalePlan, selectedTier: scaleTier };
  }
  
  const annualScalePlan = configFile.stripe.plans_annual.find(p => p.isSlider);
  if (annualScalePlan && annualScalePlan.tiers) {
    const annualScaleTier = annualScalePlan.tiers.find(tier => tier.priceId === priceId);
    if (annualScaleTier) return { ...annualScalePlan, selectedTier: annualScaleTier };
  }
  
  return null;
}

// Helper function to sanitize user input
function sanitizeUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  // Basic UUID validation (adjust pattern based on your user ID format)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(userId) ? userId : null;
}

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  // Create a private supabase client using the secret service_role API key
  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const session = await findCheckoutSession(data.object.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = data.object.client_reference_id;

        // Input validation and sanitization
        const sanitizedUserId = sanitizeUserId(userId);
        if (!sanitizedUserId) {
          console.error(`Invalid user ID in webhook: ${userId}`);
          return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        if (!customerId || typeof customerId !== 'string') {
          console.error(`Invalid customer ID in webhook: ${customerId}`);
          return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
        }

        // Validate price ID against configuration
        const plan = validatePriceId(priceId);
        if (!plan) {
          console.error(`Invalid or unauthorized price ID in webhook: ${priceId}`);
          return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
        }

        // Update the profile where id equals the userId (in table called 'profiles') and update the customer_id, price_id, and has_access (provisioning)
        await supabase
          .from("profiles")
          .update({
            customer_id: customerId,
            price_id: priceId,
            has_access: true,
          })
          .eq("id", sanitizedUserId);

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail({to: ...});
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );

        if (!subscription.customer || typeof subscription.customer !== 'string') {
          console.error(`Invalid customer ID in subscription deletion: ${subscription.customer}`);
          return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
        }

        await supabase
          .from("profiles")
          .update({ has_access: false })
          .eq("customer_id", subscription.customer);

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const priceId = data.object.lines.data[0].price.id;
        const customerId = data.object.customer;

        // Validate inputs
        if (!customerId || typeof customerId !== 'string') {
          console.error(`Invalid customer ID in invoice payment: ${customerId}`);
          return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
        }

        // Validate price ID against configuration
        const plan = validatePriceId(priceId);
        if (!plan) {
          console.error(`Invalid or unauthorized price ID in invoice payment: ${priceId}`);
          return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
        }

        // Find profile where customer_id equals the customerId (in table called 'profiles')
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (profile.price_id !== priceId) {
          console.error(`Price ID mismatch: profile has ${profile.price_id}, invoice has ${priceId}`);
          break;
        }

        // Grant the profile access to your product. It's a boolean in the database, but could be a number of credits, etc...
        await supabase
          .from("profiles")
          .update({ has_access: true })
          .eq("customer_id", customerId);

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: " + e.message + "EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
