import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req) {
  const body = await req.text();

  console.log("Stripe webhook received");

  const signature = (await headers()).get("stripe-signature");

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

  console.log(`Stripe event type: ${eventType}`);

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
        
        console.log({ customerId, priceId, userId });

        // Find the plan in your config file
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId) || configFile.stripe.plans_annual.find((p) => p.priceId === priceId) || configFile.stripe.plans.find(p => p.tiers?.some(t => t.priceId === priceId)) || configFile.stripe.plans_annual.find(p => p.tiers?.some(t => t.priceId === priceId));
        
        if (!plan) {
          console.error("Plan not found for priceId:", priceId);
          break;
        }

        console.log("Updating profile for user:", userId);
        // Update the profile where id equals the userId (in table called 'profiles') and update the customer_id, price_id, and has_access (provisioning)
        const { error } = await supabase
          .from("profiles")
          .update({
            customer_id: customerId,
            price_id: priceId,
            has_access: true,
            plan: plan.name,
          })
          .eq("id", userId);

        if (error) {
          console.error("Supabase error checkout.session.completed:", error);
        } else {
          console.log("Profile updated successfully for user:", userId);
        }

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

        console.log("Revoking access for customer:", subscription.customer);
        const { error } = await supabase
          .from("profiles")
          .update({ has_access: false })
          .eq("customer_id", subscription.customer);

        if (error) {
          console.error("Supabase error customer.subscription.deleted:", error);
        } else {
          console.log(
            "Access revoked successfully for customer:",
            subscription.customer
          );
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const priceId = data.object.lines.data[0].price.id;
        const customerId = data.object.customer;

        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId) || configFile.stripe.plans_annual.find((p) => p.priceId === priceId) || configFile.stripe.plans.find(p => p.tiers?.some(t => t.priceId === priceId)) || configFile.stripe.plans_annual.find(p => p.tiers?.some(t => t.priceId === priceId));

        // Find profile where customer_id equals the customerId (in table called 'profiles')
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (profileError || !profile) {
          console.error(
            "Supabase error or profile not found for customer:",
            customerId,
            profileError
          );
          break;
        }

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (profile.price_id !== priceId) {
          console.log(
            `Invoice paid for a different plan. User plan: ${profile.price_id}, Invoice plan: ${priceId}`
          );
          break;
        }

        // Grant the profile access to your product. It's a boolean in the database, but could be a number of credits, etc...
        console.log("Granting access for customer:", customerId);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ has_access: true, plan: plan.name })
          .eq("customer_id", customerId);

        if (updateError) {
          console.error(
            "Supabase error invoice.paid:",
            updateError
          );
        } else {
          console.log("Access granted for customer:", customerId);
        }

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
