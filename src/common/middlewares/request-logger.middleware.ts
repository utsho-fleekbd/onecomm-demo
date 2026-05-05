import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    const { method, originalUrl, ip } = req;

    res.on("finish", () => {
      const duration = Date.now() - startedAt;

      const statusCode = res.statusCode;
      const contentLength = res.getHeader("content-length") ?? 0;

      const userAgent = req.get("user-agent") ?? "unknown";

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${contentLength}b - ${ip} - ${userAgent}`,
      );
    });

    next();
  }
}
