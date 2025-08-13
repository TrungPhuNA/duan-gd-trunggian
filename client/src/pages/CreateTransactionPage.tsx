import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const CreateTransactionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link to="/transactions" className="mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo giao dịch mới</h1>
          <p className="text-gray-600">Tạo giao dịch an toàn với người bán</p>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="card">
        <div className="card-body text-center py-12">
          <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Form tạo giao dịch
          </h3>
          <p className="text-gray-600">
            Trang này sẽ có form để tạo giao dịch mới với thông tin sản phẩm, người bán, giá cả...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionPage;
