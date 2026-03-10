import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
export default supabase;
export async function insertContact(userId, contact) {
  const { data, error } = await supabase.from("contacts").insert({ user_id: userId, ...contact }).select().single();
  return { data, error };
}
export async function getAnalyses(userId) {
  const { data, error } = await supabase.from("analyses").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return { data, error };
}
export async function updateUserTier(userId, tier) {
  const { data, error } = await supabase.from("users").update({ tier }).eq("id", userId).select().single();
  return { data, error };
}
