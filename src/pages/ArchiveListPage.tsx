import { Link } from 'react-router-dom';
import { AdminProvider } from '@/contexts/AdminContext';
import { NavBar } from '@/components/NavBar';
import { useLeagueStore } from '@/store/leagueStore';
import { Archive, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ArchivedLeague } from '@/types/league';

function getDuration(archive: ArchivedLeague): string {
  if (!archive.matches || archive.matches.length === 0) {
    return new Date(archive.archivedAt).toLocaleDateString();
  }
  const dates = archive.matches.map(m => new Date(m.date).getTime());
  const first = new Date(Math.min(...dates));
  const last = new Date(Math.max(...dates));
  const sameYear = first.getFullYear() === last.getFullYear();
  if (sameYear && first.getMonth() === last.getMonth()) {
    return first.toLocaleDateString();
  }
  if (sameYear) {
    return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  return `${first.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

const ArchiveListPage = () => {
  const { archives } = useLeagueStore();

  return (
    <AdminProvider isAdmin={false}>
      <NavBar />
      <div className="min-h-screen pt-20 pb-12" style={{ background: 'var(--gradient-ocean)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Archive className="w-8 h-8 text-secondary" />
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-gold">
                Archived Leagues
              </h1>
            </div>
            <p className="text-muted-foreground">Relive the glory of past seasons</p>
          </motion.div>

          {archives.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="atlantis-card p-12 text-center"
            >
              <Archive className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-display font-semibold text-muted-foreground mb-2">No Archived Leagues Yet</h2>
              <p className="text-sm text-muted-foreground">
                Once a league is completed and archived by an admin, it will appear here.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {archives.map((archive, index) => (
                <motion.div
                  key={archive.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/archives/${archive.id}`}
                    className="block atlantis-card overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
                  >
                    <div className="h-40 overflow-hidden bg-muted/30">
                      {archive.coverImage ? (
                        <img
                          src={archive.coverImage}
                          alt={archive.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-lg font-display font-bold text-foreground mb-1">{archive.name}</h2>
                      <p className="text-xs text-muted-foreground mb-3">{getDuration(archive)}</p>
                      {archive.briefDescription ? (
                        <p className="text-sm text-muted-foreground line-clamp-3">{archive.briefDescription}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">{archive.matches.length} matches played</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminProvider>
  );
};

export default ArchiveListPage;
