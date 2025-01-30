import authApiRequest from '@/apiRequests/auth';
import { LoginBodyType } from '@/schemaValidations/auth.schema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { HttpError } from '@/lib/http';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    if (!accessToken || !refreshToken) {
        return Response.json(
            {
                message: 'Không nhận được access token và refresh token',
            },
            {
                status: 200,
            }
        );
    }

    try {
        const result = await authApiRequest.sLogout({
            accessToken,
            refreshToken,
        });

        return Response.json(result.payload);
    } catch (error) {
        console.error('Logout error:', error);

        return Response.json(
            {
                message: 'Lỗi khi gọi đến api server backend',
            },
            {
                status: 200,
            }
        );
    }
}
