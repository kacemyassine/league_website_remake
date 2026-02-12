import { AdminProvider } from '@/contexts/AdminContext';
import { NavBar } from '@/components/NavBar';
import { useLeagueStore } from '@/store/leagueStore';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';

const CHART_COLORS = [
  'hsl(180, 70%, 45%)',
  'hsl(45, 85%, 55%)',
  'hsl(0, 70%, 50%)',
  'hsl(200, 80%, 50%)',
  'hsl(280, 60%, 50%)',
];

const StatsPage = () => {
  const { teams, players, matches, archives } = useLeagueStore();

  // Win/Draw/Loss data per team
  const wdlData = teams.map(team => ({
    name: team.name,
    Wins: team.won,
    Draws: team.drawn,
    Losses: team.lost,
  }));

  // Goals breakdown pie chart
  const goalsPieData = teams.map((team, i) => ({
    name: team.name,
    value: team.goalsFor,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Player performance (top 10)
  const topPlayers = [...players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10)
    .map(p => ({
      name: p.name.split(' ').pop() || p.name,
      goals: p.goals,
      team: teams.find(t => t.id === p.teamId)?.name || '',
    }));

  // Points progression from match history
  const pointsOverTime: Record<string, number[]> = {};
  teams.forEach(t => { pointsOverTime[t.id] = [0]; });

  matches.forEach(match => {
    const homeWin = match.homeGoals > match.awayGoals;
    const draw = match.homeGoals === match.awayGoals;

    teams.forEach(t => {
      const prev = pointsOverTime[t.id]?.[pointsOverTime[t.id].length - 1] || 0;
      let add = 0;
      if (t.id === match.homeTeamId) add = homeWin ? 3 : draw ? 1 : 0;
      else if (t.id === match.awayTeamId) add = !homeWin && !draw ? 3 : draw ? 1 : 0;
      pointsOverTime[t.id]?.push(prev + add);
    });
  });

  const lineData = Array.from({ length: matches.length + 1 }, (_, i) => {
    const point: Record<string, any> = { match: i };
    teams.forEach(t => {
      point[t.name] = pointsOverTime[t.id]?.[i] || 0;
    });
    return point;
  });

  // Historical stats from archives
  const historicalData = archives.map(archive => {
    const totalGoals = archive.matches.reduce((sum, m) => sum + m.homeGoals + m.awayGoals, 0);
    return {
      name: archive.name,
      matches: archive.matches.length,
      goals: totalGoals,
      avgGoals: archive.matches.length > 0 ? +(totalGoals / archive.matches.length).toFixed(1) : 0,
    };
  });

  return (
    <AdminProvider isAdmin={false}>
      <NavBar />
      <div className="min-h-screen pt-20 pb-12" style={{ background: 'var(--gradient-ocean)' }}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-secondary" />
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-gold">
                League Stats
              </h1>
            </div>
            <p className="text-muted-foreground">Current season statistics and insights</p>
          </motion.div>

          {matches.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="atlantis-card p-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-display font-semibold text-muted-foreground mb-2">No Stats Yet</h2>
              <p className="text-sm text-muted-foreground">Play some matches to see statistics.</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Points Progression */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="atlantis-card p-6">
                <h2 className="text-xl font-display font-semibold glow-text text-primary mb-6">Points Progression</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 40%, 25%)" />
                      <XAxis dataKey="match" stroke="hsl(180, 20%, 65%)" fontSize={12} />
                      <YAxis stroke="hsl(180, 20%, 65%)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(210, 45%, 12%)',
                          border: '1px solid hsl(200, 40%, 25%)',
                          borderRadius: '8px',
                          color: 'hsl(180, 30%, 95%)',
                        }}
                      />
                      <Legend />
                      {teams.map((team, i) => (
                        <Line
                          key={team.id}
                          type="monotone"
                          dataKey={team.name}
                          stroke={CHART_COLORS[i % CHART_COLORS.length]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Win/Draw/Loss Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="atlantis-card p-6">
                  <h2 className="text-xl font-display font-semibold glow-text text-primary mb-6">Win / Draw / Loss</h2>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wdlData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 40%, 25%)" />
                        <XAxis dataKey="name" stroke="hsl(180, 20%, 65%)" fontSize={12} />
                        <YAxis stroke="hsl(180, 20%, 65%)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(210, 45%, 12%)',
                            border: '1px solid hsl(200, 40%, 25%)',
                            borderRadius: '8px',
                            color: 'hsl(180, 30%, 95%)',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Wins" fill="hsl(140, 60%, 45%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Draws" fill="hsl(200, 40%, 50%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Losses" fill="hsl(0, 70%, 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="atlantis-card p-6">
                  <h2 className="text-xl font-display font-semibold glow-text text-primary mb-6">Goals Distribution</h2>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={goalsPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {goalsPieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(210, 45%, 12%)',
                            border: '1px solid hsl(200, 40%, 25%)',
                            borderRadius: '8px',
                            color: 'hsl(180, 30%, 95%)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Top Scorers Chart */}
              {topPlayers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="atlantis-card p-6">
                  <h2 className="text-xl font-display font-semibold glow-text text-primary mb-6">Top Scorers</h2>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topPlayers} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 40%, 25%)" />
                        <XAxis type="number" stroke="hsl(180, 20%, 65%)" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="hsl(180, 20%, 65%)" fontSize={11} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(210, 45%, 12%)',
                            border: '1px solid hsl(200, 40%, 25%)',
                            borderRadius: '8px',
                            color: 'hsl(180, 30%, 95%)',
                          }}
                        />
                        <Bar dataKey="goals" fill="hsl(45, 85%, 55%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Historical Season Comparison */}
              {historicalData.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="atlantis-card p-6">
                  <h2 className="text-xl font-display font-semibold glow-text text-primary mb-6">Season History</h2>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 40%, 25%)" />
                        <XAxis dataKey="name" stroke="hsl(180, 20%, 65%)" fontSize={12} />
                        <YAxis stroke="hsl(180, 20%, 65%)" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(210, 45%, 12%)',
                            border: '1px solid hsl(200, 40%, 25%)',
                            borderRadius: '8px',
                            color: 'hsl(180, 30%, 95%)',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="matches" fill="hsl(180, 70%, 45%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="goals" fill="hsl(45, 85%, 55%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminProvider>
  );
};

export default StatsPage;
