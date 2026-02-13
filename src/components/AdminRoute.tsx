import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminPasswordDialog } from '@/components/AdminPasswordDialog';
import AdminPage from '@/pages/AdminPage';
import { useState } from 'react';
import { NavBar } from '@/components/NavBar';

/**
 * Protects the Admin route. Shows password dialog if not authenticated,
 * otherwise renders AdminPage.
 */
export function AdminRoute() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [showPasswordDialog, setShowPasswordDialog] = useState(!isAuthenticated);

  const handleOpenChange = (open: boolean) => {
    setShowPasswordDialog(open);
    if (!open && !isAuthenticated) {
      navigate('/');
    }
  };

  if (isAuthenticated) {
    return <AdminPage />;
  }

  return (
    <>
      <NavBar />
      <div className="flex min-h-screen pt-20 items-center justify-center bg-background">
        <AdminPasswordDialog
          open={showPasswordDialog}
          onOpenChange={handleOpenChange}
          onSuccess={() => setShowPasswordDialog(false)}
        />
      </div>
    </>
  );
}
