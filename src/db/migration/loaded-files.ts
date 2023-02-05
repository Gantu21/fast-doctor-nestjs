import { MigrationInterface, QueryRunner } from 'typeorm';

export class LoadedFiles1574980131233 implements MigrationInterface {
  name = 'LoadedFiles1574980131233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "loaded_files" (
        "id" SERIAL NOT NULL,
        "file_name" character varying(255) NULL,
        "file_type" integer NULL,
        "status" integer NULL,
        "account_id" integer NULL,
        "created_at" timestamp without time zone NULL,
        "updated_at" timestamp without time zone NULL,
        "file_path" character varying(255) NULL,
        "deleted_at" timestamp without time zone NULL,
        "error_log" text NULL,
        "import_started_at" timestamp without time zone NULL,
        "import_ended_at" timestamp without time zone NULL,
        CONSTRAINT "PK_6c5dcb0aab6e1b6f4784f30a0c2" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "loaded_files"`);
  }
}
