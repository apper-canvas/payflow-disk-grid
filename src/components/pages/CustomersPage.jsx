import React from 'react';
import CustomersTable from '@/components/organisms/CustomersTable';

const CustomersPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Customers</h1>
      </div>
      <CustomersTable />
    </div>
  );
};

export default CustomersPage;