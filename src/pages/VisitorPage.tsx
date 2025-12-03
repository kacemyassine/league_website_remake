import { useEffect, useState } from 'react';
import { AdminProvider } from '@/contexts/AdminContext';
import { LeagueHeader } from '@/components/LeagueHeader';
import { StandingsTable } from '@/components/StandingsTable';
import { TopScorers } from '@/components/TopScorers';
import { MatchHistory } from '@/components/MatchHistory';
import { TeamLogoUploader } from '@/components/TeamLogoUploader';
import { useLeagueStore } from '@/store/leagueStore';
import { useGitHubData } from '@/hooks/useGitHubData';
import { Loader2 } from 'lucide-react';

const VisitorPage = () => {
  const [loading, setLoading] = useState(true);
  const { setTeams, setPlayers, setMatches } = useLeagueStore();
  const { fetchData } = useGitHubData();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchData();
      if (data) {
        setTeams(data.teams);
        setPlayers(data.players);
        setMatches(data.matches);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchData, setTeams, setPlayers, setMatches]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ocean-deep via-ocean-mid to-ocean-light">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AdminProvider isAdmin={false}>
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-ocean-deep via-ocean-mid to-ocean-light">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-glow/5 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-12">
          <LeagueHeader />

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <StandingsTable />
              <TeamLogoUploader />
              <MatchHistory />
            </div>
            <TopScorers onEditPlayer={() => {}} />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default VisitorPage;
