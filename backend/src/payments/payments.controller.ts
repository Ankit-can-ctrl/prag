import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  createCheckout(@Body() dto: CheckoutDto, @Request() req: any) {
    return this.paymentsService.createCheckoutSession(dto.items, req.user.userId);
  }

  @Get('session')
  getSession(@Query('session_id') sessionId: string) {
    return this.paymentsService.getSession(sessionId);
  }
}

