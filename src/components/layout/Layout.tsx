import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../ui/Toast';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <Header />
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}
