'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((email === 'admin@pharmatrack.com' && password === 'admin123') ||
        (email === 'user@pharmatrack.com' && password === 'user123')) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('userEmail', email);
      window.location.href = '/';
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 overflow-hidden">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">PharmaTrack Lite</h1>
          <p className="text-gray-600">Sign in to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
            Sign In
          </Button>
        </form>

        <div className="space-y-3 pt-4 border-t">
          <p className="text-sm text-gray-600">Test Accounts:</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEmail('admin@pharmatrack.com');
              setPassword('admin123');
            }}
            className="w-full"
          >
            Use Test Account 1
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEmail('user@pharmatrack.com');
              setPassword('user123');
            }}
            className="w-full"
          >
            Use Test Account 2
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 pt-4">
          <p>admin@pharmatrack.com / admin123</p>
          <p>user@pharmatrack.com / user123</p>
        </div>
      </Card>
    </div>
  );
}
