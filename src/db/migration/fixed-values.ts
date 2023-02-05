import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedValues1547191220184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "fixed_values" (
            "id" serial NOT NULL,
            "branch_id" bigint,
            "clinic_name" character varying(255),
            "item_2" date,
            "item_3" date,
            "item_4" character varying(255),
            "fixed_value" character varying(255),
            "account_id" integer,
            "created_at" timestamp without time zone,
            "updated_at" timestamp without time zone,
            PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "fixed_values"`);
  }
}
