import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { projectId, feedback } = req.body;

  if (!projectId || !feedback) {
    return res.status(400).json({ error: "Missing data" });
  }

  const { data, error } = await supabase
    .from("feedbacks")
    .insert([{ project_id: projectId, feedback }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: "Feedback saved", data });
}
