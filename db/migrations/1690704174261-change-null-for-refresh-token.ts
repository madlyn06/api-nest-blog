import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNullForRefreshToken1690704174261 implements MigrationInterface {
    name = 'ChangeNullForRefreshToken1690704174261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
