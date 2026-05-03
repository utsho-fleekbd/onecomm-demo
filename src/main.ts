import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Onecomm API")
    .setDescription("Onecomm backend API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document, {
    useGlobalPrefix: true,
  });

  const port = process.env.APP_PORT || 8080;
  const localIp = process.env.LOCAL_IP!;

  await app.listen(port, localIp);

  console.log(`Server running on http://${localIp}:${port}/api/v1`);
  console.log(`Swagger running on http://${localIp}:${port}/api/v1/docs`);
}

bootstrap();
