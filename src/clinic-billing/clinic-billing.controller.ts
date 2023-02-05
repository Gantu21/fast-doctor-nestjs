import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClinicBillingService } from './clinic-billing.service';
@Controller('clinicbilling')
export class ClinicBillingController {
  constructor(private readonly clinicBillingService: ClinicBillingService) {}
  @Get()
  getClinicMaster() {
    return 'clinicMaster';
  }

  @Post('filter')
  searchClinicMaster(@Body() body) {
    return this.clinicBillingService.filterClinicBilling(body);
  }
}
