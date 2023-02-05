import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentMethodMasterMigration1597471944000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE payment_method_master (
                id SERIAL PRIMARY KEY,
                payment_method VARCHAR(255) NULL,
                payment_method_text VARCHAR(255) NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE payment_method_master;`);
  }
}
