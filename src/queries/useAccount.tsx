import accountApiRequest from '@/apiRequests/account';
import { AccountResType } from '@/schemaValidations/account.schema';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAccountMe = (onSuccess?: (data: AccountResType) => void) => {
    return useQuery({
        queryKey: ['account-me'],
        queryFn: async () => {
            const res = await accountApiRequest.me(); // Chờ dữ liệu trả về
            onSuccess && onSuccess(res.payload);
            return res; // Trả về dữ liệu cho React Query
        },
    });
};

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.update,
    });
};
