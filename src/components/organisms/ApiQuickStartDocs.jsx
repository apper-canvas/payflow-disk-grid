import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import Button from '@/components/atoms/Button';
import CodeSnippet from '@/components/molecules/CodeSnippet';

const ApiQuickStartDocs = ({ className = '' }) => {
  const authCode = `curl https://api.payflowpro.com/v1/payments \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json"`;

  const createPaymentCode = `curl https://api.payflowpro.com/v1/payments \\
  -X POST \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 2000, "currency": "usd"}'`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`mt-6 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-secondary">Quick Start</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-secondary mb-2">Authentication</h3>
            <CodeSnippet code={authCode} />
          </div>
          
          <div>
            <h3 className="font-medium text-secondary mb-2">Create Payment</h3>
            <CodeSnippet code={createPaymentCode} />
          </div>
          
          <div className="flex space-x-4">
            <Button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              View Full Documentation
            </Button>
            <Button className="text-gray-600 hover:text-secondary text-sm font-medium transition-colors">
              Download SDKs
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ApiQuickStartDocs.propTypes = {
  className: PropTypes.string,
};

export default ApiQuickStartDocs;