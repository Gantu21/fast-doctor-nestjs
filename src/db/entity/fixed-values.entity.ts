import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fixed_values')
export class FixedValues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  @ApiProperty()
  branch_id: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  clinic_name: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  item_2: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  item_3: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  item_4: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  fixed_value: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  account_id: number;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  updated_at: Date;
}
