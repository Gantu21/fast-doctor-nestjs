import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('insurance_name_master')
export class InsuranceNameMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  insurance_number: string;

  @Column({ type: 'varchar', nullable: true })
  insurance_name: string;

  @Column({ type: 'varchar', nullable: true })
  insurance_type: string;
}
