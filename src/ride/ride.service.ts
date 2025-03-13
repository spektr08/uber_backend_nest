import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { neon } from "@neondatabase/serverless";

@Injectable()
export class RideService {
  private sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("Missing DATABASE_URL in environment variables.");
    }
    this.sql = neon(databaseUrl);
  }

  async getUserRides(userId: string) {
    if (!userId) {
      throw new BadRequestException("Missing required fields");
    }

    try {
      const response = await this.sql`
        SELECT
            rides.ride_id,
            rides.origin_address,
            rides.destination_address,
            rides.origin_latitude,
            rides.origin_longitude,
            rides.destination_latitude,
            rides.destination_longitude,
            rides.ride_time,
            rides.fare_price,
            rides.payment_status,
            rides.created_at,
            'driver', json_build_object(
                'driver_id', drivers.id,
                'first_name', drivers.first_name,
                'last_name', drivers.last_name,
                'profile_image_url', drivers.profile_image_url,
                'car_image_url', drivers.car_image_url,
                'car_seats', drivers.car_seats,
                'rating', drivers.rating
            ) AS driver 
        FROM 
            rides
        INNER JOIN
            drivers ON rides.driver_id = drivers.id
        WHERE 
            rides.user_id = ${userId}
        ORDER BY 
            rides.created_at DESC;
      `;

      return { data: response };
    } catch (error) {
      console.error("Error fetching recent rides:", error);
      throw new InternalServerErrorException("Internal Server Error");
    }
  }


  async createRide(data: {
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: string;
    fare_price: number;
    payment_status: string;
    driver_id: string;
    user_id: string;
  }) {
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = data;

    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      throw new BadRequestException("Missing required fields");
    }

    try {
      const response = await this.sql`
        INSERT INTO rides ( 
            origin_address, 
            destination_address, 
            origin_latitude, 
            origin_longitude, 
            destination_latitude, 
            destination_longitude, 
            ride_time, 
            fare_price, 
            payment_status, 
            driver_id, 
            user_id
        ) VALUES (
            ${origin_address},
            ${destination_address},
            ${origin_latitude},
            ${origin_longitude},
            ${destination_latitude},
            ${destination_longitude},
            ${ride_time},
            ${fare_price},
            ${payment_status},
            ${driver_id},
            ${user_id}
        )
        RETURNING *;
      `;

      return response[0];
    } catch (error) {
      console.error("Error inserting ride:", error);
      throw new InternalServerErrorException("Internal Server Error");
    }
  }
}
