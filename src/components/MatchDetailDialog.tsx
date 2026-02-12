import { useState } from 'react';
import { useLeagueStore } from '@/store/leagueStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Edit2, Trash2, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Match, MatchEvent } from '@/types/league';

interface MatchDetailDialogProps {
  match: Match | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export function MatchDetailDialog({ match, onClose, isAdmin }: MatchDetailDialogProps) {
  const { teams, players, editMatch, deleteMatch } = useLeagueStore();
  const [editing, setEditing] = useState(false);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [scorers, setScorers] = useState<MatchEvent[]>([]);

  if (!match) return null;

  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);
  const homeWin = match.homeGoals > match.awayGoals;
  const awayWin = match.awayGoals > match.homeGoals;
  const isDraw = match.homeGoals === match.awayGoals;

  const startEditing = () => {
    setHomeGoals(match.homeGoals);
    setAwayGoals(match.awayGoals);
    setScorers([...(match.scorers || [])]);
    setEditing(true);
  };

  const handleSave = () => {
    editMatch(match.id, homeGoals, awayGoals, scorers);
    toast.success('Match updated!');
    setEditing(false);
    onClose();
  };

  const handleDelete = () => {
    deleteMatch(match.id);
    toast.success('Match deleted!');
    onClose();
  };

  const addScorer = () => {
    if (players.length === 0) return;
    setScorers(s => [...s, { playerId: players[0].id, goals: 1, isOwnGoal: false }]);
  };

  const updateScorer = (idx: number, field: keyof MatchEvent, value: any) => {
    setScorers(s => s.map((sc, i) => i === idx ? { ...sc, [field]: value } : sc));
  };

  const removeScorer = (idx: number) => {
    setScorers(s => s.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={!!match} onOpenChange={() => { setEditing(false); onClose(); }}>
      <DialogContent className="bg-card border-border max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Match Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score display */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="text-center flex-1">
              <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden border border-primary/30 bg-muted/30 flex items-center justify-center mb-2">
                {homeTeam?.logo ? (
                  <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-6 h-6 text-primary/50" />
                )}
              </div>
              <p className={cn('font-semibold text-sm', homeWin && 'text-green-400')}>{homeTeam?.name}</p>
            </div>

            <div className="text-center px-4">
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input type="number" min={0} value={homeGoals} onChange={e => setHomeGoals(parseInt(e.target.value || '0'))} className="w-16 text-center text-2xl font-bold bg-input" />
                  <span className="text-xl text-muted-foreground">-</span>
                  <Input type="number" min={0} value={awayGoals} onChange={e => setAwayGoals(parseInt(e.target.value || '0'))} className="w-16 text-center text-2xl font-bold bg-input" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-secondary">{match.homeGoals}</span>
                  <span className="text-xl text-muted-foreground">-</span>
                  <span className="text-3xl font-bold text-secondary">{match.awayGoals}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {isDraw ? 'Draw' : homeWin ? `${homeTeam?.name} wins` : `${awayTeam?.name} wins`}
              </p>
            </div>

            <div className="text-center flex-1">
              <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden border border-secondary/30 bg-muted/30 flex items-center justify-center mb-2">
                {awayTeam?.logo ? (
                  <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-6 h-6 text-secondary/50" />
                )}
              </div>
              <p className={cn('font-semibold text-sm', awayWin && 'text-green-400')}>{awayTeam?.name}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Scorers */}
          {editing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Goal Scorers</Label>
                <Button type="button" variant="outline" size="sm" onClick={addScorer}>Add Scorer</Button>
              </div>
              {scorers.map((scorer, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Select value={scorer.playerId} onValueChange={v => updateScorer(idx, 'playerId', v)}>
                    <SelectTrigger className="flex-1 bg-input border-border text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {players.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="number" min={1} value={scorer.goals} onChange={e => updateScorer(idx, 'goals', parseInt(e.target.value || '1'))} className="w-14 bg-input" />
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={scorer.isOwnGoal || false}
                      onCheckedChange={v => updateScorer(idx, 'isOwnGoal', v)}
                    />
                    <span className="text-xs text-muted-foreground">OG</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeScorer(idx)} className="text-destructive h-8 w-8">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            match.scorers && match.scorers.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Goal Scorers</h3>
                {match.scorers.map((scorer, idx) => {
                  const player = players.find(p => p.id === scorer.playerId);
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{player?.name || 'Unknown'}</span>
                      <span className="text-secondary font-bold">×{scorer.goals}</span>
                      {scorer.isOwnGoal && <span className="text-destructive text-xs">(OG)</span>}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Admin actions */}
          {isAdmin && (
            <div className="flex gap-2 pt-2">
              {editing ? (
                <>
                  <Button onClick={handleSave} className="flex-1">Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={startEditing} className="flex-1 gap-2">
                    <Edit2 className="w-4 h-4" /> Edit Match
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
