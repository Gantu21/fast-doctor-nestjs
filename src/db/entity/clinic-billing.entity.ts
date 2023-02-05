import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClinicMaster } from './clinic-master.entity';

@Entity('clinic_billing')
export class ClinicBilling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  branch_id: number;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  business_date: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  form_type: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  insurance_type: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  this_month: string;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  patient_id: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  insurance_number: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  insurance_name: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  numbers: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  days_number: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  points: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_burden_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  insurance_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  public_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  insurance_income: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  correction_reason: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  refund_assessment_month: string;

  @Column({ type: 'bool', nullable: true })
  @ApiProperty()
  claim_approval_flag: boolean;

  @Column({ type: 'bool', nullable: true })
  @ApiProperty()
  billed_flag: boolean;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  billed_date: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  account_id: string;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  loaded_files_id: number;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  updated_at: Date;

  @ManyToOne((type) => ClinicMaster)
  @JoinColumn()
  clinic: ClinicMaster;
}
