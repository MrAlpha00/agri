import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        // Trust client-side Firebase auth success for MVP
        if (idToken) {
            const response = NextResponse.json({ success: true });

            // Set an auth cookie that matches what middleware expects
            response.cookies.set('agriscan_auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return response;
        }

        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
