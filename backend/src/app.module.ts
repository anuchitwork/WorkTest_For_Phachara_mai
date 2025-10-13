import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
// import { AppDataSource } from './data-source';
@Module({
  imports: [
    // Import UsersModule
    UsersModule,

    // Config TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'worktest_for_phachara_mai',
      entities: [User],
      // migrations: ['src/migrations/*.ts'], // folder migration
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
