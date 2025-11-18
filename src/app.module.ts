import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { CreditModule } from './credit/credit.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BudgetModule } from './budget/budget.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('SECRET'),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    WalletModule,
    CreditModule,
    ExpensesModule,
    BudgetModule,
    AuthModule,
    UsersModule,
  ],
  exports: [JwtModule],
})
export class AppModule {}
