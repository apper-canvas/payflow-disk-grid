import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CustomerAvatar from '@/components/molecules/CustomerAvatar';
import StatusBadge from '@/components/molecules/StatusBadge';
import SearchFilterBar from '@/components/molecules/SearchFilterBar';
import PaginationControls from '@/components/molecules/PaginationControls';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import CreatePaymentModal from '@/components/organisms/CreatePaymentModal';
import paymentService from '@/services/api/paymentService';

const PaymentsTable = ({ onPaymentSelect }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 10;

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.getAll();
      setPayments(result);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
};

  const handlePaymentCreated = (newPayment) => {
    setPayments(prev => [newPayment, ...prev]);
  };

const handleCreatePayment = () => {
    setShowCreateModal(true);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    let filtered = payments;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
}, [payments, statusFilter, searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusFilterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'succeeded', label: 'Succeeded' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <LoadingSkeleton className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </LoadingSkeleton>
        </div>
      </div>
    );
}

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadPayments}
      />
    );
  }

  return (
    <>
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        searchPlaceholder="Search by customer, email, or payment ID..."
        filterValue={statusFilter}
        onFilterChange={(e) => setStatusFilter(e.target.value)}
        filterOptions={statusFilterOptions}
        actionButtonText="Create Payment"
        onActionButtonClick={handleCreatePayment}
      />
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon="CreditCard"
          title="No payments found"
          message={searchTerm || statusFilter !== 'all'
            ? 'Try adjusting your filters to see more results'
            : 'Payments will appear here once you start processing transactions'
          }
          actionButtonText={(!searchTerm && statusFilter === 'all') ? "Create Payment" : null}
          onActionButtonClick={(!searchTerm && statusFilter === 'all') ? handleCreatePayment : null}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
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
                    Payment Method
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-secondary">
                        {payment.id}
                      </div>
                    </td>
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
                      <div className="text-sm text-gray-500">{payment.currency?.toUpperCase() || 'USD'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ApperIcon name="CreditCard" size={16} className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-secondary">
                            {payment.paymentMethod?.brand || 'Card'} •••• {payment.paymentMethod?.last4 || '0000'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.paymentMethod?.expiryMonth || '00'}/{payment.paymentMethod?.expiryYear || '00'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onPaymentSelect(payment)}
                        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredPayments.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      )}
  
      <CreatePaymentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPaymentCreated={handlePaymentCreated}
      />
    </>
  );
};

PaymentsTable.propTypes = {
  onPaymentSelect: PropTypes.func.isRequired,
};

export default PaymentsTable;