import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function checkAndUpdateQuota(userId, tokensUsed) {
  try {
    // Get current quota
    const { data: quota, error: quotaError } = await supabase
      .from("user_quotas")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (quotaError) {
      console.error("Error fetching quota:", quotaError);
      return { error: "Failed to fetch quota" };
    }

    // Check if quota needs to be reset (new month)
    const today = new Date();
    const quotaResetDate = new Date(quota.quota_reset_date);
    if (today.getMonth() !== quotaResetDate.getMonth() || today.getFullYear() !== quotaResetDate.getFullYear()) {
      // Reset quota for new month
      const { error: resetError } = await supabase
        .from("user_quotas")
        .update({
          tokens_used: 0,
          quota_reset_date: today.toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);

      if (resetError) {
        console.error("Error resetting quota:", resetError);
        return { error: "Failed to reset quota" };
      }
      quota.tokens_used = 0;
    }

    // Check if user has exceeded their monthly cap
    if (quota.tokens_used + tokensUsed > quota.monthly_cap) {
      return { error: "Monthly token quota exceeded" };
    }

    // Update token usage
    const { error: updateError } = await supabase
      .from("user_quotas")
      .update({
        tokens_used: quota.tokens_used + tokensUsed,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating quota:", updateError);
      return { error: "Failed to update quota" };
    }

    return { success: true, remainingTokens: quota.monthly_cap - (quota.tokens_used + tokensUsed) };
  } catch (error) {
    console.error("Error in checkAndUpdateQuota:", error);
    return { error: "Internal server error" };
  }
} 