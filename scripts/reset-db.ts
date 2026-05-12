import "dotenv/config";

import { Logger } from "@nestjs/common";

import { createPrismaScriptClient } from "./prisma-script-client";

type TableRecord = {
  table_schema: string;
  table_name: string;
};

const prisma = createPrismaScriptClient();
const logger = new Logger("DBResetScript");

const quoteIdentifier = (value: string) => `"${value.replace(/"/g, '""')}"`;

const main = async () => {
  const tables = await prisma.$queryRaw<TableRecord[]>`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name <> '_prisma_migrations'
    ORDER BY table_name
  `;

  if (tables.length === 0) {
    logger.log("No database tables found to reset.");
    return;
  }

  const tableList = tables
    .map(
      (table) =>
        `${quoteIdentifier(table.table_schema)}.${quoteIdentifier(
          table.table_name,
        )}`,
    )
    .join(", ");

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`,
  );

  logger.log(`Reset database data from ${tables.length} tables.`);
};

main()
  .catch((error) => {
    logger.error(
      "Failed to reset database data.",
      error instanceof Error ? error.stack : String(error),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
