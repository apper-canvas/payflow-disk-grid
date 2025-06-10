import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CustomerAvatar from '@/components/molecules/CustomerAvatar';
import StatusBadge from '@/components/molecules/StatusBadge';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import paymentService from '@/services/api/paymentService';

const RecentPaymentsList = ({ onViewAllClick }) => {
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecentPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const payments = await paymentService.getAll();
      const sortedPayments = payments
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5);
      setRecentPayments(sortedPayments);
    } catch (err) {
      setError(err.message || 'Failed to load recent payments');
      toast.error('Failed to load recent payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentPayments();
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
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </LoadingSkeleton>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadRecentPayments}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary">Recent Payments</h2>
          <button onClick={onViewAllClick} className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            View all
          </button>
        </div>
      </div>
      
      {recentPayments.length === 0 ? (
        <EmptyState
          icon="CreditCard"
          title="No payments yet"
          message="Payments will appear here once you start processing transactions"
          actionButtonText="Create Test Payment"
          onActionButtonClick={() => toast.info("Simulating test payment creation!")}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPayments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-surface/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CustomerAvatar name={payment.customer?.name} size="small" className="mr-3 bg-primary/10 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-secondary">
                          {payment.customer?.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.customer?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-sm text-gray-500">{payment.currency.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.created).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

RecentPaymentsList.propTypes = {
  onViewAllClick: PropTypes.func.isRequired,
};

export default RecentPaymentsList;