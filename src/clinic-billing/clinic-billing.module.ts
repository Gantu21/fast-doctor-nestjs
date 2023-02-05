import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicBilling } from 'src/db/entity/clinic-billing.entity';
import { ClinicBillingController } from './clinic-billing.controller';
import { ClinicBillingService } from './clinic-billing.service';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ClinicBilling, ClinicMaster])],

  controllers: [ClinicBillingController],
  providers: [ClinicBillingService],
})
export class ClinicBillingModule {}
