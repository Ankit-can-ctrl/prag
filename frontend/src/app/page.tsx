'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShopApp</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/products" className="text-zinc-400 hover:text-white transition">
                  Products
                </Link>
                <Link href="/orders" className="text-zinc-400 hover:text-white transition">
                  Orders
                </Link>
                <span className="text-zinc-400">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-zinc-400 hover:text-white transition">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to ShopApp</h1>
          <p className="text-xl text-zinc-400 mb-8">Discover amazing products at great prices</p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition"
          >
            Browse Products
          </Link>
        </div>
      </main>
    </div>
  );
}
