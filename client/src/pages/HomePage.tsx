import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, CreditCard, AlertTriangle, ArrowRight, Star, CheckCircle, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Giao dịch an toàn',
      description: 'Hệ thống trung gian bảo vệ cả người mua và người bán'
    },
    {
      icon: Users,
      title: 'Phòng giao dịch',
      description: 'Tạo và tham gia các phòng giao dịch theo danh mục'
    },
    {
      icon: CreditCard,
      title: 'Thanh toán đảm bảo',
      description: 'Tiền được giữ an toàn cho đến khi giao dịch hoàn tất'
    },
    {
      icon: AlertTriangle,
      title: 'Hỗ trợ khiếu nại',
      description: 'Hệ thống xử lý khiếu nại chuyên nghiệp và công bằng'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản người mua hoặc người bán'
    },
    {
      step: '2',
      title: 'Tạo giao dịch',
      description: 'Người mua tạo giao dịch và thanh toán'
    },
    {
      step: '3',
      title: 'Giao hàng',
      description: 'Người bán giao hàng cho người mua'
    },
    {
      step: '4',
      title: 'Hoàn tất',
      description: 'Xác nhận và giải ngân cho người bán'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">ST</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">SafeTrade</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-blue-700/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-100 text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Nền tảng giao dịch trung gian #1 Việt Nam
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Giao dịch an toàn
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                với SafeTrade
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Hệ thống trung gian giao dịch đáng tin cậy nhất, bảo vệ 100% quyền lợi của cả người mua và người bán với công nghệ bảo mật tiên tiến
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-blue-200 text-sm">Giao dịch thành công</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-blue-200 text-sm">Độ tin cậy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Hỗ trợ khách hàng</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="group btn bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <span className="flex items-center">
                  Bắt đầu ngay miễn phí
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/login" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 transition-all duration-300">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Tính năng vượt trội
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Tại sao chọn SafeTrade?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp giải pháp giao dịch an toàn và đáng tin cậy nhất với công nghệ tiên tiến
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Quy trình đơn giản
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình giao dịch được thiết kế đơn giản, minh bạch và an toàn tuyệt đối
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-blue-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-blue-400/10 to-blue-600/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
              Tham gia cộng đồng giao dịch an toàn với hơn 10,000+ người dùng tin tưởng
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register" className="group btn bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                <span className="flex items-center">
                  Đăng ký miễn phí ngay
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/login" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-4 transition-all duration-300">
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">ST</span>
              </div>
              <span className="ml-3 text-2xl font-bold">SafeTrade</span>
            </div>
            <p className="text-gray-400 mb-6 text-lg max-w-2xl mx-auto">
              Hệ thống trung gian giao dịch an toàn và đáng tin cậy nhất Việt Nam
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-gray-400 text-sm">Giao dịch</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-gray-400 text-sm">Tin cậy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Hỗ trợ</div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                © 2024 SafeTrade. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
