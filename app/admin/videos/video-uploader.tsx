"use client";

import Script from "next/script";
import { useState } from "react";

type UploadResult = {
    event?: string;
    info?: {
        secure_url?: string;
        duration?: number;
    };
};

declare global {
    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (error: unknown, result: UploadResult) => void,
            ) => { open: () => void };
        };
    }
}

export default function VideoUploader() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [courseId, setCourseId] = useState("english-starter");
    const [message, setMessage] = useState("");

    function upload() {
        setMessage("");

        if (!window.cloudinary) {
            setMessage("Cloudinary មិនទាន់ Load រួច។ សូម Refresh ហើយសាកម្តងទៀត។");
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "dnnpf5t4",
                uploadPreset: "bluelingo_videos",
                resourceType: "video",
                sources: ["local", "url"],
                multiple: false,
                folder: "bluelingo/lessons",
                clientAllowedFormats: ["mp4", "webm", "mov"],
            },
            (error, result) => {
                if (error) {
                    const detail = typeof error === "object" ? JSON.stringify(error) : String(error);
                    setMessage(`Upload មិនជោគជ័យ៖ ${detail}`);
                    return;
                }

                if (result.event === "success" && result.info?.secure_url) {
                    setUrl(result.info.secure_url);
                    setMessage("Upload វីដេអូបានជោគជ័យ");
                }
            },
        );

        widget.open();
    }

    async function save() {
        setMessage("កំពុងរក្សាទុកមេរៀន...");
        const response = await fetch("/api/admin/lessons", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ courseId, title, videoUrl: url }),
        });

        const data = await response.json().catch(() => ({}));
        setMessage(response.ok ? "បានរក្សាទុកមេរៀនរួចហើយ" : `មិនអាចរក្សាទុកបានទេ៖ ${data.error || response.status}`);
    }

    return (
        <main className="min-h-screen bg-blue-50 p-5">
            <Script src="https://upload-widget.cloudinary.com/latest/global/all.js" strategy="afterInteractive" />
            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-7 shadow-xl">
                <a href="/admin" className="font-bold text-blue-600">← Admin</a>
                <h1 className="mt-5 text-3xl font-black text-blue-950">Upload វីដេអូមេរៀន</h1>
                <div className="mt-6 space-y-4">
                    <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="w-full rounded-xl border p-3">
                        <option value="english-starter">English Beginner</option>
                        <option value="english-work">English for Work</option>
                        <option value="chinese-starter">Chinese HSK 1</option>
                        <option value="chinese-business">Chinese Business</option>
                    </select>
                    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ចំណងជើងមេរៀន" className="w-full rounded-xl border p-3" />
                    <button onClick={upload} className="w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 font-bold text-blue-700">ជ្រើសវីដេអូពីកុំព្យូទ័រ</button>
                    {url && <video src={url} controls className="w-full rounded-2xl" />}
                    <button disabled={!url || !title} onClick={save} className="w-full rounded-xl bg-blue-600 p-3 font-bold text-white disabled:opacity-50">Publish មេរៀន</button>
                    {message && <p className="break-words rounded-xl bg-blue-50 p-3 text-center text-sm font-bold text-blue-700">{message}</p>}
                </div>
            </div>
        </main>
    );
}
