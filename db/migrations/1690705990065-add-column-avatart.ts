import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAvatart1690705990065 implements MigrationInterface {
    name = 'AddColumnAvatart1690705990065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
