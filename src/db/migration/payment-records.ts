import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentRecordsMigration1588898552051
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE payment_records (
                id bigint NOT NULL DEFAULT nextval('payment_records_id_seq'::regclass),
                branch_id varchar(255),
                patient_reception_id varchar(255),
                payment_status varchar(255),
                payment_method varchar(255),
                patient_burden_amount int,
                payment_date date,
                account_id varchar(255),
                loaded_files_id bigint,
                created_at timestamp without time zone,
                updated_at timestamp without time zone,
                patient_billing_id bigint,
                CONSTRAINT payment_records_pkey PRIMARY KEY (id),
                CONSTRAINT fk_payment_records_patient_billing_id FOREIGN KEY (patient_billing_id)
                    REFERENCES patient_billing (id) ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE payment_records`);
  }
}
