import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../types';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const schema = yup.object({
  phone: yup.string().required('Số điện thoại là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      navigate(from, { replace: true });
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
            Đăng nhập
          </h2>
          <p className="text-primary-200">
            Chào mừng bạn quay trở lại SafeTrade
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Phone field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                {...register('phone')}
                type="tel"
                className={`input ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register('password')}
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

            {/* Demo accounts */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">🚀 Tài khoản demo:</h4>
              <div className="text-xs text-blue-800 space-y-1">
                <div>Buyer: <code>0901234567</code> / <code>123456</code></div>
                <div>Seller: <code>0907654321</code> / <code>123456</code></div>
                <div>Admin: <code>admin</code> / <code>admin123456</code></div>
              </div>
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
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>

            {/* Forgot password */}
            <div className="text-center">
              <button type="button" className="text-sm text-primary-600 hover:text-primary-500">
                Quên mật khẩu?
              </button>
            </div>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
