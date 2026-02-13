import { useParams, Link } from 'react-router-dom';
import { AdminProvider } from '@/contexts/AdminContext';
import { NavBar } from '@/components/NavBar';
import { useLeagueStore } from '@/store/leagueStore';
import { BarChart3, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import NotFound from './NotFound';

const ArchiveDescriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { archives } = useLeagueStore();
  const archive = archives.find(a => a.id === id);

  if (!archive) {
    return <NotFound />;
  }

  const hasCustomPage = archive.descriptionHtml && archive.descriptionHtml.trim().length > 0;

  return (
    <AdminProvider isAdmin={false}>
      <NavBar />
      <div
        className="min-h-screen pt-20 pb-12 relative"
        style={
          archive.coverImage
            ? {
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${archive.coverImage}) center/cover no-repeat`,
                minHeight: '100vh',
              }
            : { background: 'var(--gradient-ocean)' }
        }
      >
        <div className="container mx-auto px-4 relative z-10">
          {hasCustomPage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto py-8"
            >
              {archive.descriptionCss && (
                <style dangerouslySetInnerHTML={{ __html: archive.descriptionCss }} />
              )}
              <div
                className="atlantis-card p-6 md:p-10 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: archive.descriptionHtml || '' }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center py-12"
            >
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-gold mb-6">
                {archive.name}
              </h1>
              {archive.fullDescription && (
                <p className="text-lg text-muted-foreground mb-8 whitespace-pre-wrap">
                  {archive.fullDescription}
                </p>
              )}
              {!archive.fullDescription && (
                <p className="text-muted-foreground mb-8">
                  {archive.matches.length} matches • Archived {new Date(archive.archivedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}

          {/* See League Data - at end of page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto pt-8 pb-16"
          >
            <p className="text-center text-muted-foreground mb-4 font-medium">See League Data</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/archives/${archive.id}/home`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Home className="w-5 h-5" />
                View Home Page
              </Link>
              <Link
                to={`/archives/${archive.id}/stats`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                View Stats Page
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default ArchiveDescriptionPage;
