import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from "@nestjs/config";
import { RideModule } from './ride/ride.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StripeModule, RideModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
