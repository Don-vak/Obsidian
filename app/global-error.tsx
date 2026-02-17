"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    fontFamily: 'system-ui, sans-serif',
                    backgroundColor: '#FAFAF9',
                    color: '#292524',
                    padding: '2rem',
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600 }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#78716c', marginBottom: '2rem', textAlign: 'center', maxWidth: '500px' }}>
                        We apologize for the inconvenience. Our team has been notified and is working on a fix.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#292524',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
