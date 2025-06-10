import Home from '../pages/Home'
import Payments from '../pages/Payments'
import Customers from '../pages/Customers'
import Analytics from '../pages/Analytics'
import Developers from '../pages/Developers'
import Settings from '../pages/Settings'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  payments: {
    id: 'payments',
    label: 'Payments',
    path: '/payments',
    icon: 'CreditCard',
    component: Payments
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: Customers
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  },
  developers: {
    id: 'developers',
    label: 'Developers',
    path: '/developers',
    icon: 'Code',
    component: Developers
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
}

export const routeArray = Object.values(routes)