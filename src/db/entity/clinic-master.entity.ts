import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ClinicBilling } from './clinic-billing.entity';
@Entity('clinic_master')
export class ClinicMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  clinic_code: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  clinic_name: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  clinic_kana: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  contract_type: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  postal_code: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  address_1: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  address_2: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  created_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  updated_at: Date;

  @OneToMany((type) => ClinicBilling, (clinicBilling) => clinicBilling.clinic)
  clinicBillings: ClinicBilling[];
}
