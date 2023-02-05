import { Module } from '@nestjs/common';
import { ClinicmasterController } from './clinicmaster.controller';
import { ClinicmasterService } from './clinicmaster.service';
import { ClinicMaster } from '../db/entity/clinic-master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([ClinicMaster])],
  controllers: [ClinicmasterController],
  providers: [ClinicmasterService],
})
export class ClinicmasterModule {}
