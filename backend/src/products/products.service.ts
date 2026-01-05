import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find({ isActive: true });
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  // Seed some demo products
  async seed(): Promise<string> {
    const count = await this.productModel.countDocuments();
    if (count > 0) {
      return 'Products already seeded';
    }

    const products = [
      { name: 'Wireless Headphones', description: 'High quality wireless headphones', price: 99.99, stock: 50 },
      { name: 'Smart Watch', description: 'Fitness tracking smart watch', price: 199.99, stock: 30 },
      { name: 'Laptop Stand', description: 'Ergonomic laptop stand', price: 49.99, stock: 100 },
      { name: 'USB-C Hub', description: '7-in-1 USB-C hub', price: 39.99, stock: 75 },
      { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 129.99, stock: 40 },
    ];

    await this.productModel.insertMany(products);
    return 'Products seeded successfully';
  }
}
