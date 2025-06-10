import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CustomerAvatar from '@/components/molecules/CustomerAvatar';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import customerService from '@/services/api/customerService';

const TopCustomersListing = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTopCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const customers = await customerService.getAll();
      const sortedCustomers = customers
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);
      setTopCustomers(sortedCustomers);
    } catch (err) {
      setError(err.message || 'Failed to load top customers');
      toast.error('Failed to load top customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopCustomers();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <LoadingSkeleton className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </LoadingSkeleton>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadTopCustomers}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary">Top Customers</h2>
          <ApperIcon name="Crown" size={20} className="text-warning" />
        </div>
      </div>
      
      {topCustomers.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No customer data"
          message="Customer insights will appear here once you have payment activity"
        />
      ) : (
        <div className="p-6">
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-surface rounded-lg"
              >
                <div className="flex items-center">
                  <CustomerAvatar name={customer.name} size="medium" />
                  <div className="ml-4">
                    <div className="font-medium text-secondary">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-secondary">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.paymentCount} payments
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TopCustomersListing;