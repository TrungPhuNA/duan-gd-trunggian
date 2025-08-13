import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateRoomForm {
  name: string;
  description: string;
  category: string;
  rules?: string;
  images: FileList | null;
}

const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoomForm>();

  const watchImages = watch('images');

  const categories = [
    { value: 'electronics', label: 'Điện tử' },
    { value: 'fashion', label: 'Thời trang' },
    { value: 'home', label: 'Gia dụng' },
    { value: 'books', label: 'Sách' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'other', label: 'Khác' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setValue('images', files);

      // Create preview URLs
      const previews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            previews.push(e.target.result as string);
            if (previews.length === files.length) {
              setPreviewImages(previews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);

    // Reset file input if no images left
    if (newPreviews.length === 0) {
      setValue('images', null);
    }
  };

  const onSubmit = async (data: CreateRoomForm) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Room data:', data);
      toast.success('Tạo phòng giao dịch thành công!');
      navigate('/rooms');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo phòng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/rooms" className="mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo phòng giao dịch</h1>
          <p className="text-gray-600">Tạo phòng giao dịch mới cho sản phẩm của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
          </div>
          <div className="card-body space-y-6">
            {/* Tên phòng */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Tên phòng giao dịch *
              </label>
              <input
                {...register('name', {
                  required: 'Tên phòng là bắt buộc',
                  minLength: { value: 3, message: 'Tên phòng phải có ít nhất 3 ký tự' },
                  maxLength: { value: 100, message: 'Tên phòng không được quá 100 ký tự' }
                })}
                type="text"
                className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Nhập tên phòng giao dịch"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Danh mục */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                {...register('category', { required: 'Vui lòng chọn danh mục' })}
                className={`input ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Mô tả */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả sản phẩm *
              </label>
              <textarea
                {...register('description', {
                  required: 'Mô tả sản phẩm là bắt buộc',
                  minLength: { value: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                  maxLength: { value: 1000, message: 'Mô tả không được quá 1000 ký tự' }
                })}
                rows={4}
                className={`input ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Mô tả chi tiết về sản phẩm, tình trạng, xuất xứ..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Quy tắc phòng */}
            <div>
              <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-2">
                Quy tắc phòng (tùy chọn)
              </label>
              <textarea
                {...register('rules', {
                  maxLength: { value: 500, message: 'Quy tắc không được quá 500 ký tự' }
                })}
                rows={3}
                className={`input ${errors.rules ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Các quy tắc, điều kiện giao dịch trong phòng..."
              />
              {errors.rules && (
                <p className="mt-1 text-sm text-red-600">{errors.rules.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Hình ảnh sản phẩm</h2>
          </div>
          <div className="card-body">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải lên hình ảnh (tối đa 5 ảnh)
              </label>

              {/* Upload area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                  max={5}
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB mỗi ảnh</p>
                </label>
              </div>

              {/* Preview images */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/rooms"
            className="btn btn-secondary"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo phòng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoomPage;
