"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SignUpPresale = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // First check if email already exists
      const { data: existingEmails } = await supabase
        .from("presale_subscribers")
        .select("email")
        .eq("email", email);

      if (existingEmails?.length > 0) {
        setStatus({
          type: "error",
          message: "This email is already subscribed!",
        });
        setLoading(false);
        return;
      }

      // Insert new subscriber
      const { error } = await supabase
        .from("presale_subscribers")
        .insert([{ email, subscribed_at: new Date().toISOString() }]);

      if (error) throw error;

      // Send confirmation email using Supabase's built-in email functionality
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            type: "presale_confirmation",
          },
        },
      });

      setStatus({
        type: "success",
        message: "Thanks for subscribing!",
      });
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-control w-full">
          <div className="join w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered join-item flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              className={`btn join-item btn-primary ${loading ? "loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Join Waitlist"}
            </button>
          </div>
        </div>
        {status.message && (
          <div
            className={`alert alert-outline  ${
              status.type === "success" ? "alert-success" : "alert-error"
            } text-sm`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUpPresale;
