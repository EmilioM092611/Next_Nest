// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // carga .env primero
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const password = config.get<string>('DB_PASSWORD');
        if (typeof password !== 'string') {
          throw new Error(`DB_PASSWORD debe ser string. Tipo actual: ${typeof password}`);
        }

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
          username: config.get<string>('DB_USERNAME'),
          password: password, // asegurado string
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),

    // <-- Agregar aquí tus módulos (TasksModule incluido)
    TasksModule,
    CategoriesModule,
    UsersModule,
    // ...otros imports
  ],
})
export class AppModule {}
