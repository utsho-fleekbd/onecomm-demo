import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger("Prisma");

  private readonly slowQueryMs = Number(process.env.SLOW_QUERY_MS ?? 300);
  private readonly logAllQueries = process.env.PRISMA_QUERY_LOG === "true";
  private readonly logQueryParams = process.env.PRISMA_QUERY_PARAMS === "true";

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
    // this.$on("query", (event) => {
    //   const isSlowQuery = event.duration >= this.slowQueryMs;

    //   if (!this.logAllQueries && !isSlowQuery) {
    //     return;
    //   }

    //   const query = this.compactSql(event.query);

    //   const message = [
    //     `${event.duration}ms`,
    //     query,
    //     this.logQueryParams ? `params=${event.params}` : "",
    //   ]
    //     .filter(Boolean)
    //     .join(" ");

    //   if (isSlowQuery) {
    //     this.logger.warn(`Slow query: ${message}`);
    //     return;
    //   }

    //   this.logger.debug(message);
    // });

    // this.$on("warn", (event) => {
    //   this.logger.warn(event.message);
    // });

    // this.$on("error", (event) => {
    //   this.logger.error(event.message);
    // });

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private compactSql(query: string) {
    return query.replace(/\s+/g, " ").trim();
  }
}
