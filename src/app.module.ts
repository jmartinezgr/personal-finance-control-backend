import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { CreditModule } from './credit/credit.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BudgetModule } from './budget/budget.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    WalletModule,
    CreditModule,
    ExpensesModule,
    BudgetModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
