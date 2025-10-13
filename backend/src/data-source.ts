import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export const AppDataSource = new DataSource(
  
  
//   {
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: '',
//   database: 'worktest_for_phachara_mai',
//   entities: [User],
//   migrations: ['src/migrations/*.ts'], // folder migration
//   synchronize: false,
// }


  {
  type: 'mysql',
  host: 'mysql-nunu.alwaysdata.net',      // <-- เปลี่ยนจาก localhost
  port: 3306,                              // Default ของ MySQL
  username: 'nunu',                        // <-- user ที่สร้างใน AlwaysData
  password: 'Anuanuanu22',               // <-- ใส่ password ที่ตั้งไว้
  database: 'nunu_worktest_for_phachara_mai', // <-- ชื่อ database ที่สร้าง
  entities: [User],                        // entity ของ NestJS
  synchronize: true,                        // ใช้ true ตอน dev เพื่อสร้าง table อัตโนมัติ
}



);
