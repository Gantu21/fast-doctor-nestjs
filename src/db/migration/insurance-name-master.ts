import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsuranceNameMasterTable1569380100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE insurance_name_master (
        id serial PRIMARY KEY,
        insurance_number VARCHAR(255),
        insurance_name VARCHAR(255),
        insurance_type VARCHAR(255)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE insurance_name_master`);
  }
}
