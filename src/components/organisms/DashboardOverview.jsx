import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MetricCard from '@/components/molecules/MetricCard';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import paymentService from '@/services/api/paymentService';
import customerService from '@/services/api/customerService';

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    conversionRate: 0,
    activeCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [payments, customers] = await Promise.all([
        paymentService.getAll(),
        customerService.getAll()
      ]);

      const totalRevenue = payments
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + p.amount, 0);

      const successfulPayments = payments.filter(p => p.status === 'succeeded').length;
      const conversionRate = payments.length > 0 ? (successfulPayments / payments.length) * 100 : 0;
      const activeCustomers = customers.length;

      setMetrics({
        totalRevenue,
        successfulPayments,
        conversionRate,
        activeCustomers
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <LoadingSkeleton className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </LoadingSkeleton>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadDashboardData}
        className="col-span-full"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        icon="DollarSign"
        iconBgClass="bg-gradient-to-br from-success to-success/80"
        delay={0}
      />
      <MetricCard
        title="Successful Payments"
        value={metrics.successfulPayments.toLocaleString()}
        icon="CheckCircle"
        iconBgClass="bg-gradient-to-br from-primary to-primary/80"
        delay={0.1}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate.toFixed(1)}%`}
        icon="TrendingUp"
        iconBgClass="bg-gradient-to-br from-info to-info/80"
        delay={0.2}
      />
      <MetricCard
        title="Active Customers"
        value={metrics.activeCustomers.toLocaleString()}
        icon="Users"
        iconBgClass="bg-gradient-to-br from-warning to-warning/80"
        delay={0.3}
      />
    </div>
  );
};

export default DashboardOverview;