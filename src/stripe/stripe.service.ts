import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Missing Stripe Secret Key in environment variables.");
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20" as any,
    });
  }

  async createCustomer(name: string, email: string) {
    const existingCustomers = await this.stripe.customers.list({ email });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    return await this.stripe.customers.create({ name, email });
  }

  async createPaymentIntent(customerId: string, amount: number) {
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2024-06-20" as any},
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      customer: customerId,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });
    
    return { paymentIntent, ephemeralKey, customer: customerId };
  }

  async confirmPayment(paymentMethodId: string, paymentIntentId: string, customerId: string) {
    try {
      // Attach payment method to the customer
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Confirm the payment intent
      const result = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethod.id,
      });

      return { success: true, message: "Payment successful", result };
    } catch (error) {
      console.error("Error processing payment:", error);
      throw new InternalServerErrorException("Failed to process payment");
    }
  }
}
