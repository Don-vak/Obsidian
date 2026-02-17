"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-6">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-semibold text-stone-900 mb-3">Sentry Test Page</h1>
                <p className="text-stone-500 mb-8">
                    Click the button below to trigger a test error and verify Sentry is working.
                </p>
                <button
                    onClick={() => {
                        Sentry.startSpan(
                            { op: "test", name: "Sentry Test Error" },
                            () => {
                                throw new Error("Sentry Frontend Test Error — This is intentional!");
                            }
                        );
                    }}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                    Trigger Test Error
                </button>
            </div>
        </div>
    );
}
