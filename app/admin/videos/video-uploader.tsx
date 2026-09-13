"use client";

import Script from "next/script";
import { useState } from "react";

type CloudinaryUploadInfo = {
    secure_url?: string;
    duration?: number;
};

type CloudinaryUploadResult = {
    event?: string;
    info?: CloudinaryUploadInfo | string;
};

type CloudinaryWidget = {
    open: () => void;
};

declare global {
    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (error: unknown, result: CloudinaryUploadResult) => void,
            ) => CloudinaryWidget;
        };
    }
}

function getSecureUrl(result: CloudinaryUploadResult): string | null {
    if (
        result.event === "success" &&
        typeof result.info === "object" &&
        result.info !== null &&
        typeof result.info.secure_url === "string"
    ) {
        return result.info.secure_url;
    }

    return null;
}

export default function VideoUploader() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [courseId, setCourseId] = useState("english-starter");
    const [message, setMessage] = useState("");

    function upload() {
        setMessage("");

        if (!window.cloudinary) {
            setMessage("Cloudinary មិនទាន់ដំណើរការទេ។ សូមរង់ចាំបន្តិច រួចចុចម្ដងទៀត។");
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                resourceType: "video",
                sources: ["local", "url"],
                multiple: false,
                folder: "bluelingo/lessons",
            },
            (error, result) => {
                if (error) {
                    setMessage("Upload វីដេអូមិនបានទេ។ សូមព្យាយាមម្ដងទៀត។");
                    return;
                }

                const secureUrl = getSecureUrl(result);
                if (secureUrl) {
                    setUrl(secureUrl);
                    setMessage("Upload វីដេអូបានជោគជ័យ។");
                }
            },
        );

        widget.open();
    }

    async function save() {
        setMessage("កំពុងរក្សាទុក...");

        try {
            const response = await fetch("/api/admin/lessons", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ courseId, title, videoUrl: url }),
            });

            setMessage(
                response.ok
                    ? "បានរក្សាទុកមេរៀនរួចហើយ"
                    : "មិនអាចរក្សាទុកបានទេ",
            );
        } catch {
            setMessage("មិនអាចរក្សាទុកបានទេ");
        }
    }

    return (
        <main className="min-h-screen bg-blue-50 p-5">
            <Script src="https://upload-widget.cloudinary.com/latest/global/all.js" />

            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-7 shadow-xl">
                <a href="/admin" className="font-bold text-blue-600">
                    ← Admin
                </a>

                <h1 className="mt-5 text-3xl font-black text-blue-950">
                    Upload វីដេអូមេរៀន
                </h1>

                <div className="mt-6 space-y-4">
                    <select
                        value={courseId}
                        onChange={(event) => setCourseId(event.target.value)}
                        className="w-full rounded-xl border p-3"
                    >
                        <option value="english-starter">English Beginner</option>
                        <option value="english-work">English for Work</option>
                        <option value="chinese-starter">Chinese HSK 1</option>
                        <option value="chinese-business">Chinese Business</option>
                    </select>

                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="ចំណងជើងមេរៀន"
                        className="w-full rounded-xl border p-3"
                    />

                    <button
                        type="button"
                        onClick={upload}
                        className="w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 font-bold text-blue-700"
                    >
                        ជ្រើសវីដេអូពីកុំព្យូទ័រ
                    </button>

                    {url && <video src={url} controls className="w-full rounded-2xl" />}

                    <button
                        type="button"
                        disabled={!url || !title.trim()}
                        onClick={save}
                        className="w-full rounded-xl bg-blue-600 p-3 font-bold text-white disabled:opacity-50"
                    >
                        Publish មេរៀន
                    </button>

                    {message && (
                        <p className="text-center font-bold text-blue-700">{message}</p>
                    )}
                </div>
            </div>
        </main>
    );
}
