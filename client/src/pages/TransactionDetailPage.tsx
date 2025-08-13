import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link to="/transactions" className="mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch #{id}</h1>
          <p className="text-gray-600">Thông tin chi tiết về giao dịch</p>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="card">
        <div className="card-body text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Trang chi tiết giao dịch
          </h3>
          <p className="text-gray-600">
            Trang này sẽ hiển thị thông tin chi tiết về giao dịch, trạng thái, lịch sử thay đổi...
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
