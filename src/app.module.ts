import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { ClientModule } from './client/client.module';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      // host: 'localhost',
      // username: 'postgres',
      // password: '123456',
      // port: 5432,
      // database: 'ordem_servicos',
      ssl: { rejectUnauthorized: false },
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false, // This for development,
      autoLoadEntities: true,
      migrationsTableName: 'servicos.migrations',
      migrations: ['src/migrations/*.ts'],
    }),
    StatusModule,
    ClientModule,
    ServiceModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
