import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Check for dashboard subdomain (simple check for "dashboard." prefix)
    const isDashboard = hostname.startsWith('dashboard.')

    if (isDashboard) {
        const path = url.pathname

        // Determine the new path
        // If it's /login, we verify the user is logged out or redir to admin, 
        // effectively we just treat it as the normal /login route without rewriting to /admin/login
        // If it's anything else, we prepend /admin (unless it's already there)

        let newPath = path

        // We want dashboard.com/ -> /admin
        // dashboard.com/bookings -> /admin/bookings
        // dashboard.com/login -> /login (exception)

        if (path === '/login') {
            newPath = '/login'
        } else if (!path.startsWith('/admin')) {
            newPath = `/admin${path === '/' ? '' : path}`
        }

        // Create a new request with the updated path for Auth verification
        const newUrl = url.clone()
        newUrl.pathname = newPath
        const newRequest = new NextRequest(newUrl, request)

        // Verify Session on the REWRITTEN path (e.g. /admin/bookings)
        // usage of updateSession will enforce the "must be logged in" rule for /admin paths
        const response = await updateSession(newRequest)

        // If Auth redirects (e.g. to /login), we return that redirect immediately
        if (response.status === 307 || response.status === 302) {
            return response
        }

        // If Auth allows (status 200), we perform the Rewrite
        // We must preserve any cookies set by updateSession (token refresh)
        const rewriteResponse = NextResponse.rewrite(newUrl, {
            request: {
                headers: request.headers,
            }
        })

        // Copy cookies and headers from the Auth response
        response.cookies.getAll().forEach(cookie => {
            rewriteResponse.cookies.set(cookie)
        })
        response.headers.forEach((value, key) => {
            rewriteResponse.headers.set(key, value)
        })

        return rewriteResponse
    }

    // Standard behavior for non-dashboard domains
    // We only run updateSession (Auth) for protected routes to save performance
    if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname === '/login') {
        return await updateSession(request)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images/extensions
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
