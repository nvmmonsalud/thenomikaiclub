'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Logged in successfully. You can now create reviews.');
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: email.split('@')[0]
        }
      }
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Check your email for a confirmation link.');
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('You have been signed out.');
  };

  return (
    <section>
      <h2>Login / Register</h2>
      <form className="card" onSubmit={handleLogin}>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <button type="submit" disabled={loading}>
            Log In
          </button>
        </div>
        <div className="form-row">
          <button type="button" onClick={handleRegister} disabled={loading}>
            Register
          </button>
        </div>
        <div className="form-row">
          <button type="button" onClick={handleLogout} disabled={loading}>
            Sign Out
          </button>
        </div>
      </form>
      {message ? <p className="notice">{message}</p> : null}
    </section>
  );
}
