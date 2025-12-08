import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage'; // Tu Login antiguo (está perfecto)
import DashboardPage from '../pages/DashboardPage'; // El nuevo Dashboard que te paso abajo
import LoadingSpinner from '../components/common/LoadingSpinner';

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Cargando sistema..." />;
  }

  return user ? <DashboardPage /> : <LoginPage />;
};

export default AppRouter;