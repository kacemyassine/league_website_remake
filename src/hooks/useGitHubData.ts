import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Configure your GitHub repo details here
const GITHUB_CONFIG = {
  owner: 'kacemyassine',
  repo: 'atlantis-showdown',
  path: 'src/data/defaultLeagueData.json',
  branch: 'main',
  rawUrl: 'https://raw.githubusercontent.com/kacemyassine/atlantis-showdown/main/src/data/defaultLeagueData.json ',
};

export interface LeagueData {
  teams: any[];
  players: any[];
  matches: any[];
}

export function useGitHubData() {
  const fetchData = useCallback(async (): Promise<LeagueData | null> => {
    try {
      const response = await fetch(`${GITHUB_CONFIG.rawUrl}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch data from GitHub');
      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      toast.error('Failed to fetch league data');
      return null;
    }
  }, []);

  const updateData = useCallback(async (data: LeagueData): Promise<boolean> => {
    try {
      const { data: result, error } = await supabase.functions.invoke('update-json', {
        body: {
          data,
          owner: GITHUB_CONFIG.owner,
          repo: GITHUB_CONFIG.repo,
          path: GITHUB_CONFIG.path,
          branch: GITHUB_CONFIG.branch,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error('Failed to update data on GitHub');
        return false;
      }
      if (result?.error) {
        console.error('GitHub API error:', result.error);
        toast.error(result.error);
        return false;
      }

      toast.success('Data saved to GitHub successfully!');
      return true;
    } catch (error) {
      console.error('Error updating GitHub data:', error);
      toast.error('Failed to update data');
      return false;
    }
  }, []);

  return { fetchData, updateData, config: GITHUB_CONFIG };
}
