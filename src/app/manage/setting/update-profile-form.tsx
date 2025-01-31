'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    UpdateMeBody,
    UpdateMeBodyType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAccountMe, useUpdateMeMutation } from '@/queries/useAccount';
import { useUploadMeiaMutation } from '@/queries/useMedia';
import { toast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';

export default function UpdateProfileForm() {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const updateMeMutation = useUpdateMeMutation();
    const uploadMediaMutation = useUploadMeiaMutation();

    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: '',
            avatar: '',
        },
    });
    const avatar = form.watch('avatar');
    const name = form.watch('name');

    const {
        data: dataProfile,
        refetch: reloadProfile,
        isFetching,
    } = useAccountMe((data) => {
        const { name, avatar } = data.data;
        form.reset({
            name,
            avatar: avatar ?? '',
        });
    });
    // Gọi reloadProfile để làm mới dữ liệu nếu cần
    useEffect(() => {
        if (dataProfile) {
            const { name, avatar } = dataProfile.payload.data;
            // Reset form chỉ khi dữ liệu đã có
            form.reset({
                name,
                avatar: avatar ?? '',
            });
        }
    }, [dataProfile, form]);

    // Gọi reloadProfile để làm mới dữ liệu nếu cần
    useEffect(() => {
        reloadProfile();
    }, [reloadProfile]);

    // Tạo URL cho file ảnh tạm thời
    const previewAvatar = useMemo(() => {
        if (!file) return avatar;
        return URL.createObjectURL(file);
    }, [file, avatar]);

    // Cleanup URL để tránh memory leak khi file thay đổi
    useEffect(() => {
        return () => {
            if (file) {
                URL.revokeObjectURL(previewAvatar ?? '');
            }
        };
    }, [file, previewAvatar]);

    const reset = () => {
        form.reset();
        setFile(null);
    };

    const onSubmit = async (values: UpdateMeBodyType) => {
        if (updateMeMutation.isPending) return;
        let body = values;
        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const uploadMediaResult = await uploadMediaMutation.mutateAsync(
                    formData
                );
                const imageUrl = uploadMediaResult.payload.data;
                body = {
                    ...values,
                    avatar: imageUrl,
                };
            }
            const result = await updateMeMutation.mutateAsync(body);
            toast({
                description: result.payload.message,
            });
            reloadProfile();
        } catch (error) {
            handleErrorApi({ error, setError: form.setError });
        }
    };
    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
                onReset={reset}
                onSubmit={form.handleSubmit(onSubmit, (error) => {
                    console.log('Validate form error');
                    console.log(error);
                })}
            >
                <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage
                                                    src={
                                                        previewAvatar ||
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback className="rounded-none">
                                                    {name}
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={avatarInputRef}
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        setFile(file);
                                                        field.onChange(
                                                            'https://localhost:3000/' +
                                                                field.name
                                                        );
                                                    }
                                                }}
                                            />
                                            <button
                                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                                                type="button"
                                                onClick={() =>
                                                    avatarInputRef.current?.click()
                                                }
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">
                                                    Upload
                                                </span>
                                            </button>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Tên</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                className="w-full"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className=" items-center gap-2 md:ml-auto flex">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="reset"
                                >
                                    Hủy
                                </Button>
                                <Button size="sm" type="submit">
                                    Lưu thông tin
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
