import { useParams, Link } from 'react-router-dom';
import { AdminProvider } from '@/contexts/AdminContext';
import { NavBar } from '@/components/NavBar';
import { LeagueHeader } from '@/components/LeagueHeader';
import { StandingsTable } from '@/components/StandingsTable';
import { TopScorers } from '@/components/TopScorers';
import { MatchHistory } from '@/components/MatchHistory';
import { useLeagueStore } from '@/store/leagueStore';
import { ArrowLeft } from 'lucide-react';
import NotFound from './NotFound';

const ArchiveHomePage = () => {
  const { id } = useParams<{ id: string }>();
  const { archives } = useLeagueStore();
  const archive = archives.find(a => a.id === id);

  if (!archive) {
    return <NotFound />;
  }

  const frozenCss = archive.homeCss;

  return (
    <AdminProvider isAdmin={false}>
      {frozenCss && <style data-archived-league-styles dangerouslySetInnerHTML={{ __html: frozenCss }} />}
      <NavBar />
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Hero section - same structure as VisitorPage */}
        <div className="relative w-full h-screen">
          <div className="absolute inset-0" style={{ background: 'var(--gradient-ocean)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

          <div className="relative z-10 flex flex-col justify-center items-center h-full pt-16">
            <LeagueHeader teams={archive.teams} settings={archive.settings} />
            <Link
              to={`/archives/${archive.id}`}
              className="flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {archive.name}
            </Link>
          </div>
        </div>

        {/* Content - read-only */}
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-12 max-w-full overflow-x-hidden">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6 min-w-0">
              <StandingsTable teams={archive.teams} readOnly />
              <MatchHistory matches={archive.matches} teams={archive.teams} readOnly />
            </div>
            <div className="min-w-0">
              <TopScorers
                players={archive.players}
                teams={archive.teams}
                hideButtons
              />
            </div>
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default ArchiveHomePage;
