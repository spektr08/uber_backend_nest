import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        try {
        const user = await this.userService.createUser(
            createUserDto.name,
            createUserDto.email,
            createUserDto.clerkId,
        );
        return { data: user };
        } catch (error) {
        return { error: 'Internal Server Error' };
        }
    }

}
