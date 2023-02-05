import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('status_master')
export class StatusMaster {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  status_text: string;
}
