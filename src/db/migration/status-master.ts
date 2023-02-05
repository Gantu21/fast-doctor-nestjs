import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusMasterMigration1597471944000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE status_master (
                id SERIAL PRIMARY KEY,
                status VARCHAR(255) NULL,
                status_text VARCHAR(255) NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE status_master;`);
  }
}
