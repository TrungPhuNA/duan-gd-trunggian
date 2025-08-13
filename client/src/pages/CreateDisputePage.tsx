import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const CreateDisputePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/disputes" className="mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo khiếu nại</h1>
          <p className="text-gray-600">Tạo khiếu nại cho giao dịch có vấn đề</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form tạo khiếu nại</h3>
          <p className="text-gray-600">Form tạo khiếu nại sẽ được implement ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default CreateDisputePage;
