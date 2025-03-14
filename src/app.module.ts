import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from "@nestjs/config";
import { RideModule } from './ride/ride.module';
import { DriverModule } from './driver/driver.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ClerkMiddleware } from './middlewares/clerk.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), StripeModule, RideModule, DriverModule, UserModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClerkMiddleware).forRoutes('*'); // Apply to all routes
  }
}
