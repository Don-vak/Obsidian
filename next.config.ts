import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default withSentryConfig(nextConfig, {
    // Sentry organization and project
    org: "vaktech",
    project: "javascript-nextjs",

    // Suppress noisy Sentry logs during build
    silent: !process.env.CI,
});
