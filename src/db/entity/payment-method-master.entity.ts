import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('payment_method_master')
export class PaymentMethodMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  payment_method: string;

  @Column({ type: 'varchar', nullable: true })
  payment_method_text: string;
}
