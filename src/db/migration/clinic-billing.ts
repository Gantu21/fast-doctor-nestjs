import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClinicBillingMigration1597141936020 implements MigrationInterface {
  name = 'ClinicBillingMigration1597141936020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clinic_billing" (
        "id" SERIAL NOT NULL,
        "branch_id" bigint, 
        "business_date" date, 
        "form_type" varchar(255), 
        "insurance_type" varchar(255), 
        "this_month" varchar(255), 
        "patient_id" bigint, 
        "name" varchar(255), 
        "insurance_number" varchar(255), 
        "insurance_name" text, 
        "numbers" integer, 
        "days_number" integer, 
        "points" integer, 
        "patient_burden_amount" integer, 
        "insurance_amount" integer, 
        "public_amount" integer, 
        "insurance_income" integer, 
        "correction_reason" text, 
        "refund_assessment_month" date, 
        "claim_approval_flag" boolean, 
        "billed_flag" boolean, 
        "billed_date" date, 
        "account_id" varchar(255), 
        "loaded_files_id" bigint, 
        "created_at" TIMESTAMP, 
        "updated_at" TIMESTAMP, 
        "clinic_id" integer, CONSTRAINT "PK_c0adf4dfcbcb639d255711ba26c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinic_billing" ADD CONSTRAINT "FK_e67d0844377820bebea1e01bb68" FOREIGN KEY ("clinic_id") REFERENCES "clinic_master"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clinic_billing" DROP CONSTRAINT "FK_e67d0844377820bebea1e01bb68"`,
    );
    await queryRunner.query(`DROP TABLE "clinic_billing"`);
  }
}
