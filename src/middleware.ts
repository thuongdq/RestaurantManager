import { match } from 'assert';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/manage'];
const unAuthPaths = ['/login'];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuth = Boolean(request.cookies.get('accessToken')?.value);
    const accessToken = request.cookies.get('refreshToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Chưa đăng nhập thì không cho vào privatePaths
    if (
        privatePaths.some((path) => pathname.startsWith(path)) &&
        !refreshToken
    ) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Đăng nhập rồi không cho vào trang login
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Đăng nhập rồi nhưng access token hết hạn
    if (
        privatePaths.some((path) => pathname.startsWith(path)) &&
        !accessToken &&
        refreshToken
    ) {
        const url = new URL('/logout', request.url);
        url.searchParams.set('refreshToken', refreshToken);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage/:path*', '/login'],
};
