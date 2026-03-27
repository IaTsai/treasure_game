import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AuthPage() {
  const { login, register, loginAsGuest } = useAuth();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginUsername, loginPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) {
      setError('兩次輸入的密碼不一致');
      return;
    }
    setLoading(true);
    try {
      await register(regUsername, regPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-amber-50/90 border-amber-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-900">Treasure Hunt Game</CardTitle>
          <CardDescription className="text-amber-700">登入或註冊以開始遊戲並記錄分數</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-300">
              {error}
            </div>
          )}
          <Tabs defaultValue="login" onValueChange={() => setError('')}>
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">登入</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">註冊</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">使用者名稱</Label>
                  <Input
                    id="login-username"
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">密碼</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
                  {loading ? '登入中...' : '登入'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">使用者名稱（至少 3 個字元）</Label>
                  <Input
                    id="reg-username"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    minLength={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">密碼（至少 6 個字元）</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">確認密碼</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
                  {loading ? '註冊中...' : '註冊'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-amber-300 flex-1" />
              <span className="px-3 text-sm text-amber-600">或</span>
              <div className="border-t border-amber-300 flex-1" />
            </div>
            <Button
              variant="outline"
              className="w-full border-amber-400 text-amber-800 hover:bg-amber-100"
              onClick={loginAsGuest}
            >
              以訪客身份遊玩（不記錄分數）
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
