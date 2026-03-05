import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Routes that require authentication
    const protectedRoutes = ['/dashboard', '/dataset'];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute) {
        const authCookie = request.cookies.get('agriscan_auth');

        if (!authCookie || authCookie.value !== 'authenticated') {
            // Redirect to login if not authenticated
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Secure the stats API endpoint
    if (request.nextUrl.pathname.startsWith('/api/stats')) {
        // Optional: check cookie here too for API protection
        const authCookie = request.cookies.get('agriscan_auth');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

// Config ensures middleware only runs on relevant paths to save resources
export const config = {
    matcher: ['/dashboard/:path*', '/dataset/:path*', '/api/stats'],
}
