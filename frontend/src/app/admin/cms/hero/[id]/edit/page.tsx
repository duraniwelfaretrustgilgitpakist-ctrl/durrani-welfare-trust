'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input, Textarea, Checkbox } from '@/components/admin/FormField';
import { adminApi, mediaUrl } from '@/lib/api';

export default function EditHeroPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<any>();
  const currentImage = watch('current_image');

  useEffect(() => {
    if (!id) return;
    adminApi.heroBanners.get(Number(id)).then((r) => reset({ ...r.data, current_image: r.data.background_image }));
  }, [id, reset]);

  async function onSubmit(values: any) {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'current_image' || k === 'created_at') return;
        if (v instanceof FileList && v.length > 0) fd.append(k, v[0]);
        else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
        else if (v !== null && v !== undefined && v !== '' && !(v instanceof FileList) && k !== 'background_image') fd.append(k, v as string);
      });
      await adminApi.heroBanners.update(Number(id), fd, true);
      toast.success('Banner updated');
      router.push('/admin/cms/hero');
    } catch (err: any) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed');
    }
  }

  return (
    <AdminLayout title="Edit Hero Banner">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft p-6 md:p-8 max-w-3xl">
        <Input label="Title" name="title" required register={register} errors={errors} />
        <Input label="Subtitle" name="subtitle" register={register} errors={errors} className="mt-5" />
        <Textarea label="Description" name="description" register={register} errors={errors} className="mt-5" />
        <div className="mt-5 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <label className="form-label text-amber-800">Image URL (Recommended)</label>
          <p className="text-xs text-amber-700 mb-2">Paste a URL from Cloudinary, Imgur, or any image host. This is the most reliable way to show images — uploaded files may be lost on server restart.</p>
          <Input label="" name="image_url" register={register} errors={errors} placeholder="https://res.cloudinary.com/..." />
        </div>
        <div className="mt-5">
          <label className="form-label">Upload Image (optional)</label>
          <p className="text-xs text-gray-500 mb-2">Only use this as a backup. Prefer the URL field above for reliable display.</p>
          {currentImage && <img src={mediaUrl(currentImage)} alt="" className="w-48 h-24 object-cover rounded mb-2" />}
          <input type="file" accept="image/*" {...register('background_image')} className="form-input" />
        </div>
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <Input label="Primary Button Text" name="cta_primary_text" register={register} errors={errors} />
          <Input label="Primary Button Link" name="cta_primary_link" register={register} errors={errors} />
          <Input label="Secondary Button Text" name="cta_secondary_text" register={register} errors={errors} />
          <Input label="Secondary Button Link" name="cta_secondary_link" register={register} errors={errors} />
          <Input label="Display Order" name="order" type="number" register={register} errors={errors} />
        </div>
        <Checkbox label="Active (show on website)" name="is_active" register={register} className="mt-5" />
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-200 rounded-lg font-semibold">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2 bg-dwt-500 text-white rounded-lg font-semibold disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
