import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
import ApperIcon from '../components/ApperIcon'
import paymentService from '../services/api/paymentService'
import customerService from '../services/api/customerService'

function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartType, setChartType] = useState('line')
  const [dateRange, setDateRange] = useState('30d')
  const [revenueData, setRevenueData] = useState({
    series: [],
    categories: []
  })
  const [statusBreakdown, setStatusBreakdown] = useState({
    series: [],
    labels: []
  })
  const [topCustomers, setTopCustomers] = useState([])

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      setError(null)
      try {
        const [payments, customers] = await Promise.all([
          paymentService.getAll(),
          customerService.getAll()
        ])

        // Generate revenue chart data
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return date
        })

        const revenueByDay = last30Days.map(date => {
          const dayPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.created)
            return paymentDate.toDateString() === date.toDateString() && 
                   payment.status === 'succeeded'
          })
          return dayPayments.reduce((sum, payment) => sum + payment.amount, 0) / 100
        })

        setRevenueData({
          series: [{
            name: 'Revenue',
            data: revenueByDay
          }],
          categories: last30Days.map(date => 
            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          )
        })

        // Generate status breakdown
        const statusCounts = payments.reduce((acc, payment) => {
          acc[payment.status] = (acc[payment.status] || 0) + 1
          return acc
        }, {})

        setStatusBreakdown({
          series: Object.values(statusCounts),
          labels: Object.keys(statusCounts).map(status => 
            status.charAt(0).toUpperCase() + status.slice(1)
          )
        })

        // Get top customers by total spent
        const sortedCustomers = customers
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5)
        setTopCustomers(sortedCustomers)

      } catch (err) {
        setError(err.message || 'Failed to load analytics')
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [dateRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const chartOptions = {
    chart: {
      height: 350,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#635BFF'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 5,
    },
    xaxis: {
      categories: revenueData.categories,
      labels: {
        style: {
          colors: '#64748b'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        },
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  }

  const donutOptions = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#00D924', '#F59E0B', '#EF4444', '#3B82F6'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      markers: {
        width: 8,
        height: 8
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary mb-2">Failed to load analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Analytics</h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Bar Chart
            </button>
          </div>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
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
          
          {revenueData.series.length > 0 ? (
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  type: chartType
                }
              }}
              series={revenueData.series}
              type={chartType}
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No revenue data available
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
          
          {statusBreakdown.series.length > 0 ? (
            <Chart
              options={{
                ...donutOptions,
                labels: statusBreakdown.labels
              }}
              series={statusBreakdown.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No payment data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Customers */}
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
          <div className="p-8 text-center">
            <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary mb-2">No customer data</h3>
            <p className="text-gray-600">Customer insights will appear here once you have payment activity</p>
          </div>
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
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-medium text-white">
                        {customer.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
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
    </div>
  )
}

export default Analytics