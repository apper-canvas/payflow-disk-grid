import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import paymentService from '@/services/api/paymentService';
import customerService from '@/services/api/customerService';

const CreatePaymentModal = ({ isOpen, onClose, onPaymentCreated }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    currency: 'usd',
    description: '',
    paymentMethodType: 'card'
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [errors, setErrors] = useState({});

  // Load customers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      // Reset form when modal opens
      setFormData({
        customerId: '',
        amount: '',
        currency: 'usd',
        description: '',
        paymentMethodType: 'card'
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const customerList = await customerService.getAll();
      setCustomers(customerList);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error loading customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amount > 999999.99) {
        newErrors.amount = 'Amount cannot exceed $999,999.99';
      }
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Find selected customer
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      
      // Convert amount to cents
      const amountInCents = Math.round(parseFloat(formData.amount) * 100);

      // Create payment data
      const paymentData = {
        amount: amountInCents,
        currency: formData.currency,
        description: formData.description,
        status: 'succeeded', // For demo purposes, simulate successful payment
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          email: selectedCustomer.email
        },
        paymentMethod: {
          type: formData.paymentMethodType,
          brand: 'visa', // Demo data
          last4: Math.floor(1000 + Math.random() * 9000).toString(),
          expiryMonth: Math.floor(1 + Math.random() * 12),
          expiryYear: new Date().getFullYear() + Math.floor(1 + Math.random() * 5)
        }
      };

      const newPayment = await paymentService.create(paymentData);
      
      toast.success('Payment created successfully!');
      onPaymentCreated(newPayment);
      onClose();
    } catch (error) {
      toast.error('Failed to create payment');
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = [
    { value: 'usd', label: 'USD - US Dollar' },
    { value: 'eur', label: 'EUR - Euro' },
    { value: 'gbp', label: 'GBP - British Pound' },
    { value: 'cad', label: 'CAD - Canadian Dollar' }
  ];

  const paymentMethodOptions = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'wallet', label: 'Digital Wallet' }
  ];

  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} (${customer.email})`
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Payment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Customer *
          </label>
          {loadingCustomers ? (
            <div className="flex items-center justify-center py-4">
              <ApperIcon name="Loader2" size={20} className="animate-spin text-primary" />
              <span className="ml-2 text-sm text-gray-500">Loading customers...</span>
            </div>
          ) : (
            <Select
              value={formData.customerId}
              onChange={(e) => handleInputChange('customerId', e.target.value)}
              options={[
                { value: '', label: 'Select a customer' },
                ...customerOptions
              ]}
              error={errors.customerId}
              className="w-full"
            />
          )}
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2">
              Amount *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              error={errors.amount}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Currency
            </label>
            <Select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              options={currencyOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Description *
          </label>
          <Input
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Payment for services, products, etc."
            error={errors.description}
            className="w-full"
            maxLength={255}
          />
          <p className="text-xs text-gray-500 mt-1">
            Brief description of what this payment is for
          </p>
        </div>

        {/* Payment Method Type */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Payment Method Type
          </label>
          <Select
            value={formData.paymentMethodType}
            onChange={(e) => handleInputChange('paymentMethodType', e.target.value)}
            options={paymentMethodOptions}
            className="w-full"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || loadingCustomers}
            className="min-w-[120px]"
          >
            {loading ? (
              <div className="flex items-center">
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                Creating...
              </div>
            ) : (
              'Create Payment'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

CreatePaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentCreated: PropTypes.func.isRequired,
};

export default CreatePaymentModal;