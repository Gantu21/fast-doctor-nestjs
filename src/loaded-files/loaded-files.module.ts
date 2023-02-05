import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoadedFilesController } from './loaded-files.controller';
import { LoadedFilesService } from './loaded-files.service';
import { PrintService } from 'src/print/print.service';

import { LoadedFiles } from 'src/db/entity/loaded-files.entity';
import { ClinicBilling } from 'src/db/entity/clinic-billing.entity';
import { PaymentRecords } from 'src/db/entity/payment-records.entity';
import { FixedValues } from 'src/db/entity/fixed-values.entity';
import { ClinicMaster } from 'src/db/entity/clinic-master.entity';
import { InsuranceNameMaster } from 'src/db/entity/insurance-name-master.entity';
import { PatientBilling } from 'src/db/entity/patient-billing.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoadedFiles,
      ClinicBilling,
      PaymentRecords,
      FixedValues,
      ClinicMaster,
      InsuranceNameMaster,
      PatientBilling,
    ]),
  ],
  controllers: [LoadedFilesController],
  providers: [LoadedFilesService, PrintService],
})
export class LoadedFilesModule {}
