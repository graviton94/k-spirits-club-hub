import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // Simple Basic Auth: user 'admin' and password from env (or default)
        const validPassword = process.env.ADMIN_PASSWORD || 'admin1234';

        if (user === 'admin' && pwd === validPassword) {
            return NextResponse.next();
        }
    }

    return new NextResponse('Auth Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}
