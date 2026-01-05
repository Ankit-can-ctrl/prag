import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async create(data: {
    userId: string;
    items: { productId: string; name: string; price: number; quantity: number }[];
    stripeSessionId: string;
  }): Promise<OrderDocument> {
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new this.orderModel({
      userId: data.userId,
      items: data.items,
      totalAmount,
      stripeSessionId: data.stripeSessionId,
      status: 'pending',
    });

    return order.save();
  }

  async findByUser(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findOne(id: string, userId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ _id: id, userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findBySessionId(sessionId: string): Promise<OrderDocument | null> {
    return this.orderModel.findOne({ stripeSessionId: sessionId });
  }

  async updateStatus(id: string, status: string, paymentId?: string): Promise<OrderDocument> {
    const update: any = { status };
    if (paymentId) {
      update.stripePaymentId = paymentId;
    }

    const order = await this.orderModel.findByIdAndUpdate(id, update, { new: true });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async markAsPaid(sessionId: string, paymentId: string): Promise<OrderDocument | null> {
    return this.orderModel.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { status: 'paid', stripePaymentId: paymentId },
      { new: true },
    );
  }
}

