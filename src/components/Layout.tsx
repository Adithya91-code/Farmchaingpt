import React from 'react';
import { LogOut, Wheat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100">
      <header className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wheat className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">FarmChainX</h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-orange-100">
                  Welcome, {user.name || user.email}
                </span>
                {user.farmer_id && (
                  <span className="px-2 py-1 bg-white/30 text-white rounded-full text-xs font-medium">
                    Farmer ID: {user.farmer_id}
                  </span>
                )}
                {user.distributor_id && (
                  <span className="px-2 py-1 bg-white/30 text-white rounded-full text-xs font-medium">
                    Distributor ID: {user.distributor_id}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium capitalize">
                  {user.role}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-orange-100 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;