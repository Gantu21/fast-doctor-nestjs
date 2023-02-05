import { MigrationInterface, QueryRunner } from 'typeorm';

export class PatientpaymentsMigration1583360449716
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE patient_payments (
            id serial PRIMARY KEY,
            branch_id bigint,
            patient_reception_id varchar(255),
            patient_id bigint DEFAULT 0,
            kana_name varchar(255),
            birthday date,
            insurance_number varchar(255),
            insurance_name varchar(255),
            infant_medical_recipient_number varchar(255),
            burden_ratio numeric,
            patient_subburden_amount integer,
            patient_medical_cert_amount integer,
            patient_transportation_amount integer,
            patient_deposit_amount integer,
            payment_fee integer,
            patient_billed_amount integer,
            patient_burden_amount integer,
            invoice_deposit_difference_amount integer,
            payment_status varchar(255),
            payment_method varchar(255),
            status varchar(255),
            payment_date date,
            correction_reason text,
            receipt_comment varchar(255),
            receipt_matching_result varchar(255),
            billed_date date,
            billed_flag boolean,
            account_id varchar(255),
            created_at timestamp,
            updated_at timestamp,
            business_date date,
            clinic_master_id integer,
            FOREIGN KEY (clinic_master_id) REFERENCES clinic_master (id) ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('patient_payments');
  }
}
