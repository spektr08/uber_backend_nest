import { Controller, Get, Post, Query, Body, BadRequestException } from "@nestjs/common";
import { RideService } from "./ride.service";

@Controller("rides")
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get("recent")
  async getRecentRides(@Query("id") userId: string) {
    if (!userId) {
      throw new BadRequestException("User ID is required");
    }
    
    return await this.rideService.getUserRides(userId);
  }

  @Post("create")
  async createRide(@Body() rideData: any) {
    return await this.rideService.createRide(rideData);
  }
}
