import React, { useState } from 'react';
import PaymentsTable from '@/components/organisms/PaymentsTable';
import PaymentDetailsDialog from '@/components/organisms/PaymentDetailsDialog';

const PaymentsPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Payments</h1>
      </div>
      <PaymentsTable onPaymentSelect={setSelectedPayment} />
      <PaymentDetailsDialog
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentsPage;