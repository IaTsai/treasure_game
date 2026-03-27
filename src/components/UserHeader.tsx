import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import ScoreHistory from '@/components/ScoreHistory';

export default function UserHeader() {
  const { user, isGuest, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-200/90 backdrop-blur-sm border-b border-amber-300 px-4 py-2 flex items-center justify-between">
      <span className="text-amber-900 font-medium">
        Welcome, {user.username}
        {isGuest && <span className="text-amber-600 text-sm ml-1">（分數不會被記錄）</span>}
      </span>
      <div className="flex gap-2">
        {!isGuest && <ScoreHistory />}
        <Button
          variant="outline"
          onClick={logout}
          className="border-amber-400 text-amber-800 hover:bg-amber-100"
        >
          {isGuest ? '返回登入' : 'Logout'}
        </Button>
      </div>
    </div>
  );
}
