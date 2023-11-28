import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoList1701095798138 implements MigrationInterface {
  name = 'CreateTodoList1701095798138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."todo_item_status_enum" AS ENUM('todo', 'in_progress', 'done')`,
    );
    await queryRunner.query(
      `CREATE TABLE "todo_item" ("id" SERIAL NOT NULL, "title" character varying, "status" "public"."todo_item_status_enum" NOT NULL DEFAULT 'todo', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "todoListId" integer, CONSTRAINT "PK_d454c4b9eac15cc27c2ed8e4138" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "todo_list" ("id" SERIAL NOT NULL, "name" character varying, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1a5448d48035763b9dbab86555b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ccba8168dcb33ca73fd63e0c7" ON "todo_list" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_item" ADD CONSTRAINT "FK_3aba7e189db12c46ca339996459" FOREIGN KEY ("todoListId") REFERENCES "todo_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_list" ADD CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todo_list" DROP CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_item" DROP CONSTRAINT "FK_3aba7e189db12c46ca339996459"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ccba8168dcb33ca73fd63e0c7"`,
    );
    await queryRunner.query(`DROP TABLE "todo_list"`);
    await queryRunner.query(`DROP TABLE "todo_item"`);
    await queryRunner.query(`DROP TYPE "public"."todo_item_status_enum"`);
  }
}
