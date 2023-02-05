import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('loaded_files')
export class LoadedFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  file_name: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  file_type: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  status: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty()
  account_id: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  created_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  updated_at: Date;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  file_path: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  deleted_at: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  error_log: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  import_started_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty()
  import_ended_at: Date;
}
