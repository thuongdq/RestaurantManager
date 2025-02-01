'use client';
import { getRefreshTokenFromLocalStorage } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { log } from 'console';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { useEffect, useRef } from 'react';

export default function LogoutPage() {
    const { mutateAsync } = useLogoutMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshTokenFromUrl = searchParams.get('refreshToken');
    const ref = useRef<any>(null);

    useEffect(() => {
        if (
            ref.current ||
            refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
        ) {
            return;
        }
        ref.current = mutateAsync;
        mutateAsync().then((res) => {
            setTimeout(() => {
                ref.current = null;
            }, 1000);
            router.push('/login');
        });
        return () => {};
    }, [mutateAsync, router]);

    return <div>Logout Page</div>;
}
