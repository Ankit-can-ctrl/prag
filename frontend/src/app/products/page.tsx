'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { cart, addToCart, removeFromCart, getCartCount, getCartTotal } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 bg-zinc-950 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">ShopApp</Link>
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-white font-medium">Products</Link>
            {user && (
              <Link href="/orders" className="text-zinc-400 hover:text-white transition">Orders</Link>
            )}
            {getCartCount() > 0 && (
              <Link
                href="/checkout"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
              >
                Cart ({getCartCount()}) - ${getCartTotal().toFixed(2)}
              </Link>
            )}
            {user ? (
              <button onClick={logout} className="text-zinc-400 hover:text-white transition">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-zinc-400 hover:text-white transition">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 mb-4">No products available</p>
            <button
              onClick={async () => {
                await api.get('/products/seed');
                fetchProducts();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Load Demo Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="h-48 bg-zinc-800 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-500">${product.price}</span>
                    {getItemQuantity(product._id) > 0 ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                        >
                          -
                        </button>
                        <span>{getItemQuantity(product._id)}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {getCartCount() > 0 && (
          <div className="fixed bottom-6 right-6">
            <Link
              href="/checkout"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              Checkout ({getCartCount()} items) - ${getCartTotal().toFixed(2)}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
