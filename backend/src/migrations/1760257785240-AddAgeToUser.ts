import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgeToUser1760257785240 implements MigrationInterface {
    name = 'AddAgeToUser1760257785240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pid\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pid\``);
    }

}
