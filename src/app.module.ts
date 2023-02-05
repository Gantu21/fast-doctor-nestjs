import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';

import { LoadedFilesModule } from './loaded-files/loaded-files.module';
import { ClinicmasterModule } from './clinicmaster/clinicmaster.module';
import { ClinicBillingModule } from './clinic-billing/clinic-billing.module';
import { PrintModule } from './print/print.module';
import { PatientBillingModule } from './patient-billing/patient-billing.module';

import { ClinicMaster } from './db/entity/clinic-master.entity';
import { LoadedFiles } from './db/entity/loaded-files.entity';
import { ClinicBilling } from './db/entity/clinic-billing.entity';
import { PaymentRecords } from './db/entity/payment-records.entity';
import { FixedValues } from './db/entity/fixed-values.entity';
import { PaymentMethodMaster } from './db/entity/payment-method-master.entity';
import { InsuranceNameMaster } from './db/entity/insurance-name-master.entity';
import { StatusMaster } from './db/entity/status-master.entity';
import { PatientBilling } from './db/entity/patient-billing.entity';
import { Patientpayments } from './db/entity/patient-payments.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'fast_doctor',
      password: 'User_2019',
      database: 'fast_db',
      entities: [
        ClinicMaster,
        LoadedFiles,
        ClinicBilling,
        FixedValues,
        PaymentRecords,
        PaymentMethodMaster,
        InsuranceNameMaster,
        StatusMaster,
        PatientBilling,
        Patientpayments,
      ],
      synchronize: true,
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   username: 'fast_user',
    //   password: 'User2023',
    //   port: 5432,
    //   host: 'localhost',
    //   database: 'fast_db-v2',
    //   synchronize: true,
    //   entities: [ClinicMaster, LoadedFiles, ClinicBilling],

    //   // entities: ['dist/**/*.entity{.ts,.js}'],
    // }),
    ClinicmasterModule,
    PatientBillingModule,
    LoadedFilesModule,
    ClinicBillingModule,
    PrintModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
