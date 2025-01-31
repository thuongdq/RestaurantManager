import { mediaApiRequest } from '@/apiRequests/media';
import { useMutation } from '@tanstack/react-query';

export const useUploadMeiaMutation = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload,
    });
};
