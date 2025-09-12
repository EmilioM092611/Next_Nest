// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log simple de todas las requests (útil para debugging local)
  // Sólo en entorno de desarrollo
  const configService = app.get(ConfigService);
  const env = configService.get<string>('NODE_ENV') ?? 'development';
  if (env === 'development') {
    // Express middleware directo
    (app as any).use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(`[HTTP] ${req.method} ${req.url}`);
      next();
    });
  }

  // Habilitar CORS sólo desde el front local (puerto 3002)
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3002',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true,
  });

  // Prefijo global para tus rutas (opcional pero recomendable)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // ValidationPipe global para DTOs (class-validator)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }));

  // --- Configurar Swagger SOLO en development ---
  if (env === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mi API')
      .setDescription('Documentación de la API (Swagger)')
      .setVersion('1.0')
      .addBearerAuth() // si usas JWT/Bearer
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    // La ruta quedará: http://localhost:{PORT}/api/docs
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
    console.log(`📚 Swagger habilitado en /${globalPrefix}/docs`);
  }

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  console.log(`📊 Environment: ${env}`);
  console.log(`🗄️  Database: ${configService.get('DB_NAME')} on ${configService.get('DB_HOST')}:${configService.get('DB_PORT')}`);
}

bootstrap().catch((err) => {
  console.error('❌ Error starting application:', err);
  process.exit(1);
});
