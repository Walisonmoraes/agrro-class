import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { DashboardEnhanced } from './pages/DashboardEnhanced';
import { DashboardFinanceiro } from './pages/DashboardFinanceiro';
import { Login } from './pages/Login';
import { Clients } from './pages/Clients';
import { ServiceOrders } from './pages/ServiceOrders';
import { Classification } from './pages/Classification';
import { Billing } from './pages/Billing';
import { Destinations } from './pages/Destinations';
import { EmbarkationPoints } from './pages/EmbarkationPoints';
import { Classifiers } from './pages/Classifiers';
import { Products } from './pages/Products';
import { Faturas } from './pages/Faturas';
import { NHE } from './pages/NHE';
import { UsersPage } from './pages/Users';
import { HRPage } from './pages/HR';
import { PlateOccurrencesPage } from './pages/PlateOccurrences';
import { ProductionPage } from './pages/Production';
import { AuditsPage } from './pages/AuditsPage';
import { Vehicles } from './pages/Vehicles';
import { Maintenance } from './pages/Maintenance';
import { FuelPage } from './pages/Fuel';
import { VehicleChecklist } from './pages/VehicleChecklist';
import { Drivers } from './pages/Drivers';
import { EmbarkationMap } from './pages/EmbarkationMap';
import { BillingModal } from './components/BillingModal';

export default function App() {
  const { token } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('embarkation-map');
  const [selectedOS, setSelectedOS] = useState<number | null>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(0);

  if (!token) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardEnhanced />;
      case 'dashboard-financeiro': return <DashboardFinanceiro />;
      case 'clients': return <Clients />;
      case 'users': return <UsersPage />;
      case 'rh': return <HRPage />;
      case 'plate-occurrences': return <PlateOccurrencesPage />;
      case 'production': return <ProductionPage />;
      case 'audits': return <AuditsPage />;
      case 'vehicles': return <Vehicles />;
      case 'maintenance': return <Maintenance />;
      case 'fuel': return <FuelPage />;
      case 'checklist': return <VehicleChecklist />;
      case 'drivers': return <Drivers />;
      case 'embarkation-map': return <EmbarkationMap />;
      case 'orders': return <ServiceOrders 
        key={refreshOrders} 
        onClassify={(id) => { setSelectedOS(id); setCurrentPage('laudos'); }} 
        onBill={(id) => { setSelectedOS(id); setShowBillingModal(true); }} 
      />;
      case 'laudos': return <Classification osId={selectedOS} onBack={() => { setSelectedOS(null); setCurrentPage('orders'); }} />;
      case 'billing': return <Billing />;
      case 'destinations': return <Destinations />;
      case 'embarkation': return <EmbarkationPoints />;
      case 'classifiers': return <Classifiers />;
      case 'products': return <Products />;
      case 'rne': return <NHE />;
      default: return <div className="p-8 text-stone-500 italic">Página em desenvolvimento...</div>;
    }
  };

  return (
    <Layout current={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
      
      {/* Modal de Faturamento */}
      {showBillingModal && selectedOS && (
        <BillingModal 
          osId={selectedOS}
          onClose={() => {
            setShowBillingModal(false);
            setSelectedOS(null);
          }}
          onSuccess={() => {
            // Fechar modal e limpar estado
            setShowBillingModal(false);
            setSelectedOS(null);
            
            // Forçar redirecionamento imediato
            setCurrentPage('billing');
            
            // Atualizar a lista de ordens após o redirecionamento
            setTimeout(() => {
              setRefreshOrders(prev => prev + 1);
            }, 200);
          }}
        />
      )}
    </Layout>
  );
}
