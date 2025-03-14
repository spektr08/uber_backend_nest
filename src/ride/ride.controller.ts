import { Controller, Get, Post, Query, Body, BadRequestException, UseGuards, Req } from "@nestjs/common";
import { RideService } from "./ride.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { Request } from "express"; 

@Controller("rides")
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get("recent")
  @UseGuards(AuthGuard)
  async getRecentRides(@Query("id") userId: string,@Req() req: Request) {
    if (!userId) {
      throw new BadRequestException("User ID is required");
    }
    
    console.log('User ID:',req.auth?.userId);
    return await this.rideService.getUserRides(userId);
  }

  @Post("create")
  async createRide(@Body() rideData: any) {
    return await this.rideService.createRide(rideData);
  }
}
