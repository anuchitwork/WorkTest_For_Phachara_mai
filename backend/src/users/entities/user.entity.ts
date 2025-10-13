import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ type: 'date' })
  birthday: string; 

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  uuid: string; 

  @Column()
  pid: number;
}