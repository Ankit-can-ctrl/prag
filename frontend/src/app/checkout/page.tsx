"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setProcessing(true);
    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await api.post("/payments/checkout", { items });

      if (res.data.url) {
        clearCart();
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Checkout failed");
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            ShopApp
          </Link>
          <Link
            href="/products"
            className="text-zinc-400 hover:text-white transition"
          >
            ← Back to Products
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center py-3 border-b border-zinc-800"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-700">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-500">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {!user && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-lg mb-6">
            Please{" "}
            <Link href="/login" className="underline">
              login
            </Link>{" "}
            to complete your purchase
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={processing || !user}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-lg font-medium transition"
        >
          {processing ? "Processing..." : `Pay $${getCartTotal().toFixed(2)}`}
        </button>

        <p className="text-center text-zinc-500 text-sm mt-4">
          Test card: 4242 4242 4242 4242
        </p>
      </main>
    </div>
  );
}
