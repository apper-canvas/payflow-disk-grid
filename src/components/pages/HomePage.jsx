import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from '@/components/organisms/DashboardOverview';
import RecentPaymentsList from '@/components/organisms/RecentPaymentsList';

const HomePage = () => {
  const navigate = useNavigate();

  const handleViewAllPayments = () => {
    navigate('/payments');
  };

  return (
    <div className="p-6 space-y-6">
      <DashboardOverview />
      <RecentPaymentsList onViewAllClick={handleViewAllPayments} />
    </div>
  );
};

export default HomePage;