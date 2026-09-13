import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Lesson = {
    id: string;
    title: string;
    video_url: string;
    duration: string | null;
};

const courseNames: Record<string, string> = {
    "english-starter": "អង់គ្លេសសម្រាប់អ្នកចាប់ផ្ដើម",
    "english-work": "អង់គ្លេសសម្រាប់ការងារ",
    "chinese-starter": "ភាសាចិនកម្រិតដំបូង HSK 1",
    "chinese-business": "ភាសាចិនសម្រាប់អាជីវកម្ម",
};

export default async function LearnPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;

    const supabase = await createSupabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );

    const { data: payment } = await admin
        .from("payments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .eq("status", "approved")
        .limit(1)
        .maybeSingle();

    if (!payment) {
        redirect("/#dashboard");
    }

    const { data, error } = await admin
        .from("lessons")
        .select("id,title,video_url,duration")
        .eq("course_id", courseId);

    const lessons = (data || []) as Lesson[];

    return (
        <main className="min-h-screen bg-blue-50 px-4 py-8">
            <div className="mx-auto max-w-5xl">
                <a href="/#dashboard" className="font-bold text-blue-600">
                    ← ត្រឡប់ទៅវគ្គរបស់ខ្ញុំ
                </a>

                <div className="mt-6 rounded-3xl bg-blue-950 p-7 text-white">
                    <p className="text-sm font-bold uppercase text-cyan-300">
                        BlueLingo Course
                    </p>

                    <h1 className="mt-2 text-3xl font-black">
                        {courseNames[courseId] || "វគ្គសិក្សា"}
                    </h1>

                    <p className="mt-2 text-blue-200">
                        ចូលរៀនដោយគណនី៖ {user.email}
                    </p>
                </div>

                {error ? (
                    <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">
                        មិនអាចទាញយកមេរៀនបាន៖ {error.message}
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow">
                        <h2 className="text-xl font-black text-blue-950">
                            មិនទាន់មានវីដេអូមេរៀន
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Admin ត្រូវ Upload និង Publish វីដេអូមេរៀនជាមុន។
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 space-y-6">
                        {lessons.map((lesson, index) => (
                            <article
                                key={lesson.id}
                                className="overflow-hidden rounded-3xl bg-white shadow-lg"
                            >
                                <div className="p-5">
                                    <p className="text-sm font-bold text-blue-600">
                                        មេរៀនទី {index + 1}
                                    </p>

                                    <h2 className="mt-1 text-xl font-black text-blue-950">
                                        {lesson.title}
                                    </h2>

                                    {lesson.duration && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            រយៈពេល៖ {lesson.duration}
                                        </p>
                                    )}
                                </div>

                                <video
                                    src={lesson.video_url}
                                    controls
                                    controlsList="nodownload"
                                    className="aspect-video w-full bg-black"
                                />
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}