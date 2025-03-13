import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("payment")
  async handlePayment(@Body() body: { name: string; email: string; amount: number }) {
    const { name, email, amount } = body;

    if (!name || !email || !amount) {
      return { error: "Missing required fields" };
    }

    const customer = await this.stripeService.createCustomer(name, email);
    const paymentData = await this.stripeService.createPaymentIntent(customer.id, amount);

    return paymentData;
  }

  @Post("pay")
  async handlePay(@Body() body: { payment_method_id: string; payment_intent_id: string; customer_id: string }) {
    const { payment_method_id, payment_intent_id, customer_id } = body;
  
    if (!payment_method_id || !payment_intent_id || !customer_id) {
      throw new BadRequestException("Missing required fields");
    }

    return await this.stripeService.confirmPayment(payment_method_id, payment_intent_id, customer_id);
  }
}
