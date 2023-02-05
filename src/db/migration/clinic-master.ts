import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClinicMasterMigration1598805434758 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE clinic_master (
        id serial PRIMARY KEY,
        clinic_code bigint,
        clinic_name varchar,
        clinic_kana varchar,
        contract_type int,
        postal_code int,
        address_1 text,
        address_2 text,
        created_at timestamp without time zone,
        updated_at timestamp without time zone
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE clinic_master');
  }
}
