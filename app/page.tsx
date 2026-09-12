import LearningApp from "./learning-app";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return <LearningApp user={user ? { name: String(user.user_metadata.full_name || user.email), email: user.email! } : null} signInPath="/login" signOutPath="/auth/signout" />;
}
