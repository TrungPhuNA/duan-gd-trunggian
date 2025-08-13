import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { RegisterForm } from '../types';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      role: 'buyer'
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back button */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="flex items-center text-white hover:text-primary-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại trang chủ
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">ST</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Đăng ký tài khoản
          </h2>
          <p className="text-primary-200">
            Tham gia cộng đồng giao dịch an toàn
          </p>
        </div>

        {/* Register form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Hidden role field - default to buyer */}
            <input
              {...register('role')}
              type="hidden"
              value="buyer"
            />

            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                {...register('name', {
                  required: 'Họ tên là bắt buộc',
                  minLength: { value: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                })}
                type="text"
                className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Nhập họ và tên"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                type="tel"
                className={`input ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (tùy chọn)
              </label>
              <input
                {...register('email')}
                type="email"
                className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng ký...
                </div>
              ) : (
                'Đăng ký'
              )}
            </button>

            {/* Terms */}
            <div className="text-center text-sm text-gray-600">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <button type="button" className="text-primary-600 hover:text-primary-500">
                Điều khoản sử dụng
              </button>{' '}
              và{' '}
              <button type="button" className="text-primary-600 hover:text-primary-500">
                Chính sách bảo mật
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
