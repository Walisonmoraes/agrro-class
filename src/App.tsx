import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Clients } from './pages/Clients';
import { ServiceOrders } from './pages/ServiceOrders';
import { Classification } from './pages/Classification';
import { Billing } from './pages/Billing';
import { Destinations } from './pages/Destinations';
import { EmbarkationPoints } from './pages/EmbarkationPoints';
import { Classifiers } from './pages/Classifiers';
import { Products } from './pages/Products';
import { Reports } from './pages/Reports';
import { Faturas } from './pages/Faturas';

export default function App() {
  const { token } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedOS, setSelectedOS] = useState<number | null>(null);

  if (!token) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'orders': return <ServiceOrders onClassify={(id) => { setSelectedOS(id); setCurrentPage('laudos'); }} onBill={(id) => { setSelectedOS(id); setCurrentPage('billing_page'); }} />;
      case 'laudos': return <Classification osId={selectedOS} onBack={() => { setSelectedOS(null); setCurrentPage('orders'); }} />;
      case 'billing_page': return <Billing osId={selectedOS!} onBack={() => { setSelectedOS(null); setCurrentPage('orders'); }} />;
      case 'destinations': return <Destinations />;
      case 'embarkation': return <EmbarkationPoints />;
      case 'classifiers': return <Classifiers />;
      case 'products': return <Products />;
      case 'reports': return <Reports />;
      case 'faturas': return <Faturas />;
      default: return <div className="p-8 text-stone-500 italic">Página em desenvolvimento...</div>;
    }
  };

  return (
    <Layout current={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
