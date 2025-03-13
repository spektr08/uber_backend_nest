import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { neon } from "@neondatabase/serverless";

@Injectable()
export class DriverService {
  private sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("Missing DATABASE_URL in environment variables.");
    }
    this.sql = neon(databaseUrl);
  }

  async getDrivers() {
    try {
      return await this.sql`SELECT * FROM drivers`;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch drivers');
    }
  }
}
