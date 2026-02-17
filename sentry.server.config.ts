import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://fb4c8a3f98684241b9e8f7819046b214@o4510901751971840.ingest.us.sentry.io/4510901760950272",

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

    // Enable structured logging
    enableLogs: true,

    // Capture console errors automatically
    integrations: [
        Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] }),
    ],

    // Environment tag
    environment: process.env.NODE_ENV || "development",
});
