import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment_records')
export class PaymentRecords {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', nullable: true })
  branch_id: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  patient_reception_id: string;

  @Column({ type: 'varchar', nullable: true })
  payment_status: string;

  @Column({ type: 'varchar', nullable: true })
  payment_method: string;

  @Column({ type: 'int', nullable: true })
  patient_burden_amount: number;

  @Column({ type: 'date', nullable: true })
  payment_date: string;

  @Column({ type: 'varchar', nullable: true })
  account_id: string;

  @Column({ type: 'bigint', nullable: true })
  loaded_files_id: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date;
}
