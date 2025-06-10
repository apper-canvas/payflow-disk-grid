import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import paymentService from '@/services/api/paymentService';

const AnalyticsChartsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
  const [dateRange, setDateRange] = useState('30d'); // '7d', '30d', '90d'
  const [allPayments, setAllPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const payments = await paymentService.getAll();
        setAllPayments(payments);
      } catch (err) {
        setError(err.message || 'Failed to load payment data for charts');
        toast.error('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const { revenueData, statusBreakdown } = useMemo(() => {
    const today = new Date();
    let startDate = new Date();
    if (dateRange === '7d') startDate.setDate(today.getDate() - 6);
    if (dateRange === '30d') startDate.setDate(today.getDate() - 29);
    if (dateRange === '90d') startDate.setDate(today.getDate() - 89);

    const relevantPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.created);
      return paymentDate >= startDate && paymentDate <= today;
    });

    // Revenue Chart Data
    const revenueByDayMap = new Map();
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      revenueByDayMap.set(d.toDateString(), 0);
    }

    relevantPayments.forEach(payment => {
      if (payment.status === 'succeeded') {
        const paymentDate = new Date(payment.created).toDateString();
        if (revenueByDayMap.has(paymentDate)) {
          revenueByDayMap.set(paymentDate, revenueByDayMap.get(paymentDate) + payment.amount / 100);
        }
      }
    });

    const categories = Array.from(revenueByDayMap.keys()).map(dateString =>
      new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const data = Array.from(revenueByDayMap.values());

    const revenueSeries = [{ name: 'Revenue', data }];

    // Status Breakdown Data
    const statusCounts = relevantPayments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    const statusSeries = Object.values(statusCounts);
    const statusLabels = Object.keys(statusCounts).map(status =>
      status.charAt(0).toUpperCase() + status.slice(1)
    );

    return {
      revenueData: { series: revenueSeries, categories },
      statusBreakdown: { series: statusSeries, labels: statusLabels }
    };
  }, [allPayments, dateRange]);

  const chartOptions = {
    chart: {
      height: 350,
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
    },
    colors: ['#635BFF'],
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100] } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 5 },
    xaxis: {
      categories: revenueData.categories,
      labels: { style: { colors: '#64748b' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b' },
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    tooltip: { y: { formatter: (value) => `$${value.toLocaleString()}` } }
  };

  const donutOptions = {
    chart: { type: 'donut', animations: { enabled: true, easing: 'easeinout', speed: 800 } },
    colors: ['#00D924', '#F59E0B', '#EF4444', '#3B82F6'],
    plotOptions: { pie: { donut: { size: '70%' } } },
    legend: { position: 'bottom', fontSize: '14px', markers: { width: 8, height: 8 } },
    dataLabels: { enabled: false },
    responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }]
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <LoadingSkeleton className="h-80 w-full"></LoadingSkeleton>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <LoadingSkeleton className="h-80 w-full"></LoadingSkeleton>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex space-x-2">
          <Button
            onClick={() => setChartType('line')}
            className={chartType === 'line' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          >
            Line Chart
          </Button>
          <Button
            onClick={() => setChartType('bar')}
            className={chartType === 'bar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          >
            Bar Chart
          </Button>
        </div>
        <Select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary">Revenue Trend</h2>
            <ApperIcon name="TrendingUp" size={20} className="text-success" />
          </div>
          
          {revenueData.series[0]?.data.some(d => d > 0) ? (
            <Chart
              options={{ ...chartOptions, chart: { ...chartOptions.chart, type: chartType } }}
              series={revenueData.series}
              type={chartType}
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No revenue data available for this period
            </div>
          )}
        </motion.div>

        {/* Payment Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary">Payment Status</h2>
            <ApperIcon name="PieChart" size={20} className="text-primary" />
          </div>
          
          {statusBreakdown.series.length > 0 && statusBreakdown.series.some(d => d > 0) ? (
            <Chart
              options={{ ...donutOptions, labels: statusBreakdown.labels }}
              series={statusBreakdown.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No payment status data available
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AnalyticsChartsPanel;