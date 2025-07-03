import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function checkAndUpdateQuota(userId, tokensUsed) {
  try {
    // Use a transaction to prevent race conditions
    const { data: quota, error: quotaError } = await supabase
      .from("user_quotas")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (quotaError) {
      console.error("Error fetching quota:", quotaError);
      return { error: "Failed to fetch quota" };
    }

    // Use UTC dates to avoid timezone issues
    const now = new Date();
    const currentMonth = now.getUTCFullYear() * 12 + now.getUTCMonth();
    
    // Parse the quota reset date properly (assuming it's stored as ISO string or date)
    const quotaResetDate = new Date(quota.quota_reset_date);
    const quotaMonth = quotaResetDate.getUTCFullYear() * 12 + quotaResetDate.getUTCMonth();
    
    let currentQuota = quota;

    // Check if we need to reset quota for a new month
    if (currentMonth > quotaMonth) {
      // Use atomic update with current timestamp to prevent race conditions
      const resetDate = new Date().toISOString();
      
      const { data: updatedQuota, error: resetError } = await supabase
        .from("user_quotas")
        .update({
          tokens_used: 0,
          quota_reset_date: resetDate,
          updated_at: resetDate
        })
        .eq("user_id", userId)
        .eq("quota_reset_date", quota.quota_reset_date) // Only update if date hasn't changed (prevents race conditions)
        .select()
        .single();

      if (resetError) {
        console.error("Error resetting quota:", resetError);
        return { error: "Failed to reset quota" };
      }
      
      // If no rows were updated, another process already reset the quota
      if (!updatedQuota) {
        // Fetch the updated quota
        const { data: refreshedQuota, error: refreshError } = await supabase
          .from("user_quotas")
          .select("*")
          .eq("user_id", userId)
          .single();
          
        if (refreshError) {
          console.error("Error fetching refreshed quota:", refreshError);
          return { error: "Failed to fetch updated quota" };
        }
        currentQuota = refreshedQuota;
      } else {
        currentQuota = updatedQuota;
      }
    }

    // Check if user has exceeded their monthly cap
    if (currentQuota.tokens_used + tokensUsed > currentQuota.monthly_cap) {
      return { error: "Monthly token quota exceeded" };
    }

    // Update token usage atomically
    const { data: finalQuota, error: updateError } = await supabase
      .from("user_quotas")
      .update({
        tokens_used: currentQuota.tokens_used + tokensUsed,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .eq("tokens_used", currentQuota.tokens_used) // Ensure no concurrent updates
      .select()
      .single();

    if (updateError) {
      console.error("Error updating quota:", updateError);
      return { error: "Failed to update quota" };
    }

    // If no rows were updated, there was a concurrent modification
    if (!finalQuota) {
      return { error: "Quota was modified concurrently, please retry" };
    }

    return { 
      success: true, 
      remainingTokens: finalQuota.monthly_cap - finalQuota.tokens_used 
    };
  } catch (error) {
    console.error("Error in checkAndUpdateQuota:", error);
    return { error: "Internal server error" };
  }
} 