import { Controller, Get } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller('drivers')
export class DriverController {
    constructor(private readonly driverService: DriverService) {}


    @Get()
    async getDrivers() {
        try {
        const drivers = await this.driverService.getDrivers();
        return { data: drivers };
        } catch (error) {
        return { error: 'Internal Server Error' };
        }
    }
}
