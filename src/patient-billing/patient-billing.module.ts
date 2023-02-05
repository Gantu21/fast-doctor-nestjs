import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientBillingService } from './patient-billing.service';
import { PatientBillingController } from './patient-billing.controller';
import { PatientBilling } from '../db/entity/patient-billing.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import { Patientpayments } from '../db/entity/patient-payments.entity';
import { PaymentRecords } from '../db/entity/payment-records.entity';
import { LoadedFiles } from '../db/entity/loaded-files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientBilling,
      ClinicMaster,
      Patientpayments,
      PaymentRecords,
      LoadedFiles,
    ]),
  ],
  providers: [PatientBillingService],
  controllers: [PatientBillingController],
})
export class PatientBillingModule {}
