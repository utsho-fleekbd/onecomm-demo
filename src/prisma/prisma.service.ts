import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const databaseUrl = configService.getOrThrow<string>("DATABASE_URL");

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({
      adapter,
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "error" },
        { emit: "stdout", level: "warn" },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on("query" as never, (event: any) => {
      console.log(
        `[QUERY] \n\t\tduration: ${event.duration}ms \n\t\tquery: ${event.query} \n\t\tparams: ${event.params}`,
      );
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
