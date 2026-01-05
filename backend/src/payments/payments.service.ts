import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCheckoutSession(items: { productId: string; name: string; price: number; quantity: number }[], userId: string) {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/cancel`,
      metadata: {
        userId,
        items: JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity }))),
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async getSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}

