import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Score {
  id: number;
  score: number;
  result: string;
  played_at: string;
}

interface Stats {
  totalGames: number;
  wins: number;
  totalScore: number;
}

export default function ScoreHistory() {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const [stats, setStats] = useState<Stats>({ totalGames: 0, wins: 0, totalScore: 0 });

  useEffect(() => {
    if (!open) return;
    apiGet<{ scores: Score[]; stats: Stats }>('/api/scores')
      .then(data => {
        setScores(data.scores);
        setStats(data.stats);
      })
      .catch(() => {});
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-amber-400 text-amber-800 hover:bg-amber-100">
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-900">Game History</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <div className="text-sm text-amber-600">Total Games</div>
            <div className="text-xl font-bold text-amber-900">{stats.totalGames}</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Wins</div>
            <div className="text-xl font-bold text-green-700">{stats.wins}</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Total Score</div>
            <div className={`text-xl font-bold ${stats.totalScore >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              ${stats.totalScore}
            </div>
          </div>
        </div>

        {scores.length === 0 ? (
          <p className="text-center text-amber-600 py-4">No game records yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="text-sm">
                    {new Date(s.played_at + 'Z').toLocaleString()}
                  </TableCell>
                  <TableCell className={s.score >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${s.score}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      s.result === 'Win' ? 'bg-green-100 text-green-700' :
                      s.result === 'Tie' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {s.result}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
