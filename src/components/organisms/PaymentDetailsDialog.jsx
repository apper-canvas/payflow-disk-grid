import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/molecules/Modal';
import StatusBadge from '@/components/molecules/StatusBadge';

const PaymentDetailsDialog = ({ isOpen, onClose, payment }) => {
  if (!payment) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" className="max-w-2xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-secondary mb-3">Payment Information</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Payment ID</label>
              <p className="font-mono text-sm">{payment.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Amount</label>
              <p className="font-medium">{formatCurrency(payment.amount)} {payment.currency.toUpperCase()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <StatusBadge status={payment.status} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Created</label>
              <p>{new Date(payment.created).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-secondary mb-3">Customer & Payment Method</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Customer</label>
              <p>{payment.customer?.name || 'Anonymous'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p>{payment.customer?.email || 'No email'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Method</label>
              <p>{payment.paymentMethod?.brand} •••• {payment.paymentMethod?.last4}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Expires</label>
              <p>{payment.paymentMethod?.expiryMonth}/{payment.paymentMethod?.expiryYear}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

PaymentDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  payment: PropTypes.object,
};

export default PaymentDetailsDialog;