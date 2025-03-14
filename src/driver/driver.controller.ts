import { Controller, Get, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('drivers')
export class DriverController {
    constructor(private readonly driverService: DriverService) {}


    @Get()
    @UseGuards(AuthGuard)
    async getDrivers() {
        try {
        const drivers = await this.driverService.getDrivers();
        return { data: drivers };
        } catch (error) {
        return { error: 'Internal Server Error' };
        }
    }
}
