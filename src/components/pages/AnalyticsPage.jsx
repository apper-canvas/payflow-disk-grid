import React from 'react';
import AnalyticsChartsPanel from '@/components/organisms/AnalyticsChartsPanel';
import TopCustomersListing from '@/components/organisms/TopCustomersListing';

const AnalyticsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Analytics</h1>
      </div>
      <AnalyticsChartsPanel />
      <TopCustomersListing />
    </div>
  );
};

export default AnalyticsPage;