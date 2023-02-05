import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import {ClinicMaster} from './clinic-master.entity'

@Entity('patient_payments')
export class Patientpayments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  branch_id: number;

  @Column({type: 'varchar', nullable: true})
  @ApiProperty()
  patient_reception_id: string

  @Column({ type: 'bigint', nullable: true , default: 0 })
  @ApiProperty()
  patient_id: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  kana_name: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  birthday: Date | string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  insurance_number: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  insurance_name: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  infant_medical_recipient_number: string;

  @Column({ type: 'numeric', nullable: true })
  @ApiProperty()
  burden_ratio: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_subburden_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_medical_cert_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_transportation_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_deposit_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  payment_fee: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_billed_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  patient_burden_amount: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  invoice_deposit_difference_amount: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  payment_status: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  payment_method: number | string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  status: number | string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  payment_date: string | Date;       

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  correction_reason: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  receipt_comment: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  receipt_matching_result: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  billed_date: Date | string;

  @Column({ type: 'bool', nullable: true })
  @ApiProperty()
  billed_flag: boolean;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  account_id: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  created_at: Date | string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  business_date: Date | string;

  @ManyToOne(type => ClinicMaster)
  @JoinColumn()
  clinic_master: ClinicMaster;

}
