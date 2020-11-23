import { MigrationInterface, QueryRunner } from 'typeorm'
import { walkByDBTables } from './migration-utils'


export class CreateDB1605622729069 implements MigrationInterface {

  public async up (queryRunner: QueryRunner): Promise<void> {
    for await (const { table, sql } of walkByDBTables('create')) {
      console.log(`create table: ${table}`)
      await queryRunner.query(sql)
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    for await (const { table } of walkByDBTables('create')) {
      try {
        console.log(`drop table: ${table}`)
        await queryRunner.query(`drop table \`${table}\`;`)
      } catch {}
    }
  }

}
