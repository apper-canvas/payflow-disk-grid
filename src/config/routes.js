import HomePage from '@/components/pages/HomePage'
import PaymentsPage from '@/components/pages/PaymentsPage'
import CustomersPage from '@/components/pages/CustomersPage'
import AnalyticsPage from '@/components/pages/AnalyticsPage'
import DevelopersPage from '@/components/pages/DevelopersPage'
import SettingsPage from '@/components/pages/SettingsPage'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  payments: {
    id: 'payments',
    label: 'Payments',
    path: '/payments',
    icon: 'CreditCard',
component: PaymentsPage
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
component: CustomersPage
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
component: AnalyticsPage
  },
  developers: {
    id: 'developers',
    label: 'Developers',
    path: '/developers',
    icon: 'Code',
component: DevelopersPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
}

export const routeArray = Object.values(routes)