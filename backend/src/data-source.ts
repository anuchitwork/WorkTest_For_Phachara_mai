import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'worktest_for_phachara_mai',
  entities: [User],
  migrations: ['src/migrations/*.ts'], // folder migration
  synchronize: false,
});
