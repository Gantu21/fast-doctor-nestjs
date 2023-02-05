import { MigrationInterface, QueryRunner } from 'typeorm';

export class PatientBilling1581326365438 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "patient_billing" (
       "id" SERIAL NOT NULL,
       "branch_id" bigint,
       "loaded_files_id" bigint,
       "business_date" date,
       "patient_id" bigint DEFAULT 0, 
       "patient_reception_id" character varying(255),
       "kana_name" character varying(255), 
       "birthday" date, 
       "insurance_number" character varying(255), 
       "insurance_name" character varying(255), 
       "infant_medical_recipient_number" character varying(255), 
       "burden_ratio" numeric, 
       "patient_subburden_amount" integer, 
       "patient_medical_cert_amount" integer,
       "patient_transportation_amount" integer, 
       "patient_deposit_amount" integer, 
       "payment_fee" integer, "amount" integer, 
       "payment_method" integer,
       "status" integer, 
       "receipt_comment" character varying(255),
       "billing_updated_at" TIMESTAMP, 
       "correction_reason" character varying(255), 
       "billed_date" date, 
       "billed_flag" boolean, 
       "account_id" character varying(255), 
       "created_at" TIMESTAMP,
       "updated_at" TIMESTAMP, 
       CONSTRAINT "PK_97e2458f917ad0a0d94bb7c7a68" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_billing" ADD CONSTRAINT "FK_bcd6f9314e07b43013874a9c101" FOREIGN KEY ("clinic_master_id") REFERENCES "clinic_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_billing" ADD CONSTRAINT "FK_b1f10f12e20b0c66dc8b40f1e4e" FOREIGN KEY ("payment_records_id") REFERENCES "payment_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "patient_billing" DROP CONSTRAINT "FK_b1f10f12e20b0c66dc8b40f1e4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_billing" DROP CONSTRAINT "FK_bcd6f9314e07b43013874a9c101"`,
    );
    await queryRunner.query(`DROP TABLE "patient_billing"`);
  }
}
