import { createSupabaseServer } from "@/lib/supabase/server";
import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const supabase = await createSupabaseServer(); const {data:{user}}=await supabase.auth.getUser();
  if (!user) return <main className="grid min-h-screen place-items-center bg-blue-50 p-6"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"><h1 className="text-2xl font-black text-blue-950">Admin Dashboard</h1><p className="mt-3 text-slate-600">សូមចូលគណនី Admin ដើម្បីបន្ត។</p><a href="/login" className="mt-6 block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">ចូលគណនី</a></div></main>;
  return <AdminDashboard userEmail={user.email!}/>;
}
