import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { neon } from "@neondatabase/serverless";

@Injectable()
export class UserService {
  private sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("Missing DATABASE_URL in environment variables.");
    }
    this.sql = neon(databaseUrl);
  }

  async createUser(name: string, email: string, clerkId: string) {
    try {
      const result = await this.sql`
        INSERT INTO users (name, email, clerk_id)
        VALUES (${name}, ${email}, ${clerkId})
        RETURNING *;
      `;
      return result[0]; // Return the inserted user
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to create user');
    }
  }
}
