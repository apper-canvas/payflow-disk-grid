import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './components/ApperIcon'
import { routeArray } from './config/routes'

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CreditCard" size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-secondary">PayFlow Pro</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-surface rounded-lg px-3 py-2">
              <ApperIcon name="Search" size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search payments, customers..."
                className="bg-transparent border-none outline-none text-sm text-secondary placeholder-gray-400 w-64"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-surface transition-colors">
              <ApperIcon name="Bell" size={18} className="text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface border-r border-gray-200 z-40">
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-white hover:text-secondary'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-gray-200 z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="CreditCard" size={16} className="text-white" />
                    </div>
                    <h1 className="text-lg font-semibold text-secondary">PayFlow Pro</h1>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" size={18} />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-600 hover:bg-white hover:text-secondary'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={18} />
                        <span>{route.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout