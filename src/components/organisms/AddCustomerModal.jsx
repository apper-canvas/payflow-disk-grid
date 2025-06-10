import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Modal from '@/components/molecules/Modal';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import customerService from '@/services/api/customerService';

const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newCustomer = await customerService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined
      });
      
      toast.success('Customer added successfully!');
      onCustomerAdded(newCustomer);
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Customer">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter customer's full name"
            className={errors.name ? 'border-error' : ''}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter customer's email address"
            className={errors.email ? 'border-error' : ''}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter customer's phone number"
            className={errors.phone ? 'border-error' : ''}
            disabled={loading}
          />
          {errors.phone && (
            <p className="text-error text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

AddCustomerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCustomerAdded: PropTypes.func.isRequired,
};

export default AddCustomerModal;