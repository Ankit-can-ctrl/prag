'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function AuthCallbackPage() {
  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Set cookie
      Cookies.set('token', token, { expires: 7 });
      // Clear URL and redirect
      window.location.replace('/');
    } else {
      window.location.replace('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400">Completing login...</p>
      </div>
    </div>
  );
}
