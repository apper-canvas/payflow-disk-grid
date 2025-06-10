import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CustomerAvatar from '@/components/molecules/CustomerAvatar';
import SearchFilterBar from '@/components/molecules/SearchFilterBar';
import PaginationControls from '@/components/molecules/PaginationControls';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import AddCustomerModal from '@/components/organisms/AddCustomerModal';
import customerService from '@/services/api/customerService';
const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 10;
const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerService.getAll();
      setCustomers(result);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleAddCustomerClick = () => {
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    let filtered = customers;
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setCurrentPage(1); // Reset page on search change
    return filtered;
  }, [customers, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        onRetry={loadCustomers}
      />
    );
  }

  return (
    <>
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        searchPlaceholder="Search by name or email..."
actionButtonText="Add Customer"
        onActionButtonClick={handleAddCustomerClick}
      />

      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No customers found"
          message={searchTerm
            ? 'Try adjusting your search to see more results'
            : 'Customers will appear here once you start accepting payments'
          }
actionButtonText={!searchTerm ? "Add First Customer" : null}
          onActionButtonClick={!searchTerm ? handleAddCustomerClick : null}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payments
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CustomerAvatar name={customer.name} size="medium" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-secondary">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary">
                        {customer.paymentCount} payments
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.defaultPaymentMethod ? (
                        <div className="flex items-center">
                          <ApperIcon name="CreditCard" size={16} className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-secondary">
                              {customer.defaultPaymentMethod.brand} •••• {customer.defaultPaymentMethod.last4}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.defaultPaymentMethod.expiryMonth}/{customer.defaultPaymentMethod.expiryYear}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No payment method</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-secondary text-sm font-medium transition-colors">
                          Edit
                        </button>
                      </div>
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
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
)}

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
};

export default CustomersTable;