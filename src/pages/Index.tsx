import { useState } from 'react';
import { LeagueHeader } from '@/components/LeagueHeader';
import { StandingsTable } from '@/components/StandingsTable';
import { TopScorers } from '@/components/TopScorers';
import { MatchHistory } from '@/components/MatchHistory';
import { PlayerForm } from '@/components/PlayerForm';
import { MatchForm } from '@/components/MatchForm';
import { TeamLogoUploader } from '@/components/TeamLogoUploader';
import { Button } from '@/components/ui/button';
import { useLeagueStore } from '@/store/leagueStore';
import { UserPlus, Play, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [matchFormOpen, setMatchFormOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  const { matches, resetLeague } = useLeagueStore();

  const handleEditPlayer = (playerId: string) => {
    setEditingPlayerId(playerId);
    setPlayerFormOpen(true);
  };

  const handlePlayerFormClose = (open: boolean) => {
    setPlayerFormOpen(open);
    if (!open) setEditingPlayerId(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-ocean-deep via-ocean-mid to-ocean-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-glow/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-12">
        <LeagueHeader />

        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in">
          <Button
            onClick={() => setPlayerFormOpen(true)}
            className="gap-2"
            variant="outline"
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </Button>

          <Button
            onClick={() => setMatchFormOpen(true)}
            className="gap-2"
            disabled={matches.length >= 50}
          >
            <Play className="w-4 h-4" />
            Record Match ({matches.length}/50)
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset League
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset League?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all matches, players, and reset team stats.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetLeague}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <StandingsTable />
            <TeamLogoUploader />
            <MatchHistory />
          </div>
          <TopScorers onEditPlayer={handleEditPlayer} />
        </div>
      </div>

      <PlayerForm
        open={playerFormOpen}
        onOpenChange={handlePlayerFormClose}
        editingPlayerId={editingPlayerId}
      />

      <MatchForm
        open={matchFormOpen}
        onOpenChange={setMatchFormOpen}
      />
    </div>
  );
};

export default Index;
