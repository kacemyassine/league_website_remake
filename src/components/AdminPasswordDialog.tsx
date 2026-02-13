import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle } from 'lucide-react';

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminPasswordDialog({ open, onOpenChange, onSuccess }: AdminPasswordDialogProps) {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(password)) {
      setPassword('');
      onOpenChange(false);
      navigate('/admin2604');
      onSuccess?.();
    } else {
      setError('Incorrect password. Access forbidden.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <div className="flex justify-center -mt-2 mb-2">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
            <Lock className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-center font-display">Admin Access</DialogTitle>
          <DialogDescription className="text-center">
            Enter the admin password to access the admin panel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="bg-input border-border"
              autoFocus
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <Button type="submit" className="w-full">Access Admin</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
