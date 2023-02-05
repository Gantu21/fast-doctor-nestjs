import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadedFiles } from 'src/db/entity/loaded-files.entity';
import { ClinicBilling } from 'src/db/entity/clinic-billing.entity';
import { PaymentRecords } from 'src/db/entity/payment-records.entity';
import { FixedValues } from 'src/db/entity/fixed-values.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import { PatientBilling } from 'src/db/entity/patient-billing.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoadedFiles,
      ClinicBilling,
      PaymentRecords,
      FixedValues,
      ClinicMaster,
      PatientBilling,
    ]),
  ],
  providers: [PrintService],
})
export class PrintModule {}
