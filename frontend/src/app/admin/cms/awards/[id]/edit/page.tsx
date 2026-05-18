'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Checkbox } from '@/components/admin/FormField';
import { adminApi, mediaUrl } from '@/lib/api';

export default function EditAwardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<any>();
  const currentImage = watch('current_image');

  useEffect(() => {
    if (!id) return;
    adminApi.awards.get(id).then((r) =>
      reset({ ...r.data, current_image: r.data.image, image: undefined, image_url: r.data.image_url || '' })
    );
  }, [id, reset]);

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'current_image') return;
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '' && !(v instanceof FileList) && k !== 'image') fd.append(k, v as string);
      });
      await adminApi.awards.update(id, fd, true);
      toast.success('Award updated');
      router.push('/admin/cms/awards');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Edit Award">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <Input label="Award Title" name="title" required register={register} errors={errors} />
        <Input label="Organisation" name="organization" register={register} errors={errors} className="mt-5" />
        <Input label="Year" name="year" register={register} errors={errors} className="mt-5" />
        <Textarea label="Description" name="description" register={register} errors={errors} rows={4} className="mt-5" />
        <Input label="Display Order" name="order" type="number" register={register} errors={errors} className="mt-5" />
        <div className="mt-5 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <label className="form-label text-amber-800">Image URL (Recommended)</label>
          <p className="text-xs text-amber-700 mb-2">Paste a URL from Cloudinary, Imgur, or any image host. More reliable than file upload.</p>
          <Input label="" name="image_url" register={register} errors={errors} placeholder="https://res.cloudinary.com/..." />
        </div>
        <div className="mt-5">
          <label className="form-label">Upload Photo / Certificate (optional)</label>
          {currentImage && <img src={mediaUrl(currentImage)} alt="" className="w-48 h-32 object-cover rounded mb-2" />}
          <input type="file" accept="image/*" {...register('image')} className="form-input" />
        </div>
        <div className="flex gap-6 mt-5">
          <Checkbox label="Active" name="is_active" register={register} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> Save
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
