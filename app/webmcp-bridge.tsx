"use client";
import { useEffect } from "react";

declare global {
  interface Document { modelContext?: { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> } }
}

export default function WebMCPBridge({ startEnrollment }: { startEnrollment: (courseId: string) => boolean }) {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "start_course_enrollment",
      title: "Start course enrollment",
      description: "Open the payment and receipt-upload flow for one BlueLingo course.",
      inputSchema: { type: "object", properties: { courseId: { type: "string", enum: ["english-starter", "english-work", "chinese-starter", "chinese-business"] } }, required: ["courseId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) { const id = (input as { courseId?: string })?.courseId; if (!id || !startEnrollment(id)) throw new Error("Unknown course"); return { courseId: id, status: "enrollment_opened" }; },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [startEnrollment]);
  return null;
}
