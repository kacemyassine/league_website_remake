import { useRef } from 'react';
import { useLeagueStore } from '@/store/leagueStore';
import { useAdmin } from '@/contexts/AdminContext';
import { Shield, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TeamLogoUploader() {
  const { teams, updateTeamLogo } = useLeagueStore();
  const { isAdmin } = useAdmin();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleLogoUpload = (teamId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateTeamLogo(teamId, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="atlantis-card p-6 animate-fade-in">
      <h2 className="text-2xl font-display font-semibold mb-6 glow-text text-primary">
        Team Logos
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="text-center">
            <div
              className={cn(
                'w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 bg-muted/30 flex items-center justify-center transition-colors',
                team.id === 'team1' ? 'border-primary/50' : 'border-secondary/50',
                isAdmin && 'cursor-pointer hover:border-primary'
              )}
              onClick={() => isAdmin && fileInputRefs.current[team.id]?.click()}
            >
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={`${team.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Shield className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <p className={cn(
              'mt-2 font-semibold',
              team.id === 'team1' ? 'text-primary' : 'text-secondary'
            )}>
              {team.name}
            </p>
            {isAdmin && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (fileInputRefs.current[team.id] = el)}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(team.id, file);
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs gap-1"
                  onClick={() => fileInputRefs.current[team.id]?.click()}
                >
                  <Upload className="w-3 h-3" />
                  Upload Logo
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
