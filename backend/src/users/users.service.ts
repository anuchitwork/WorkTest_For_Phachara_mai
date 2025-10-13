import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In , MoreThan, LessThan } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


async create(createUserDto: CreateUserDto): Promise<User> {
    // 1️⃣ หา pid สูงสุด
    const maxPidUser = await this.userRepository
        .createQueryBuilder('user')
        .select('MAX(user.pid)', 'max')
        .getRawOne();

    const maxPid = maxPidUser?.max ?? 0; // ถ้าไม่มี user เลย → 0

    // 2️⃣ สร้าง user
    const user = this.userRepository.create({
        ...createUserDto,
        pid: maxPid + 1, // เพิ่มต่อเนื่อง
    });

    // 3️⃣ บันทึก
    const savedUser = await this.userRepository.save(user);
    return savedUser;
}


  async findAll(limit?: number): Promise<User[]> {
    if (limit && limit > 0) {
      // ใช้ find with take (limit) ของ TypeORM
      return this.userRepository.find({ take: limit });
    }
    return this.userRepository.find(); // ดึงทั้งหมด
  }

  findOne(id: number) {
    return `This action returns aaaaaaaaaaaaa #${id} user`;
  }

  // // ✅ ดึงข้อมูลหลาย id + นับจำนวนทั้งหมดใน table
  // async findMany(ids: number[]): Promise<{ users: User[]; totalCount: number }> {
  //   // ดึงข้อมูลตาม id ที่ส่งมา
  //   const users = await this.userRepository.find({
  //     where: { pid: In(ids) },
  //   });
  //   // นับจำนวนทั้งหมดในฐานข้อมูล (ทุก user)
  //   const totalCount = await this.userRepository.count();
  //   return { users, totalCount };
  // }


async findMany(
  ids: number[] = [],
  take: number = 5,
  type: 'next' | 'back' = 'next'
): Promise<{ users: User[]; totalCount: number }> {
  let users: User[];
  this.logger.log(`findMany called with ids: ${ids}, take: ${take}, type: ${type}`);
  if (type === 'next') {
    const lastPid = ids.length ? Math.max(...ids) : 0;
    this.logger.log('next');
    users = await this.userRepository.find({
      where: { pid: MoreThan(lastPid) },
      order: { pid: 'ASC' },
      take,
    });
  } else if (type === 'back') {
    let minPid: number;
    this.logger.log('back ids', ids);
    if (ids.length) {
      minPid = Math.min(...ids);
      // this.logger.log('back');
    } else {
      // ถ้าไม่มี ids ให้หา pid สูงสุดใน DB
      const maxPidUser = await this.userRepository
        .createQueryBuilder('user')
        .select('MAX(user.pid)', 'max')
        .getRawOne();

      minPid = maxPidUser?.max ?? 0; // ถ้า DB ว่าง → 0
    }

    users = await this.userRepository.find({
      where: { pid: LessThan(minPid) },
      order: { pid: 'DESC' },
      take,
    });
    users = users.reverse(); // กลับลำดับให้เป็น ASC
  } else {
    throw new Error('Invalid type, must be "next" or "back"');
  }

  const totalCount = await this.userRepository.count();

  return { users, totalCount };
}





async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  // หา user ตัวจริงใน DB
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) throw new Error(`User with id ${id} not found`);

  // Merge ข้อมูลใหม่กับ user เดิม
  const updatedUser = this.userRepository.merge(user, updateUserDto);

  // บันทึกลง DB
  return this.userRepository.save(updatedUser);
}


async remove(id: number) {
    // 1️⃣ หาค่า pid ของ user ที่จะลบ
    const userToDelete = await this.userRepository.findOne({ where: { id } });
    if (!userToDelete) throw new Error('User not found');

    const pidToDelete = userToDelete.pid;

    // 2️⃣ ลบ user
    await this.userRepository.delete(id);

    return `User #${id} removed`;
}
}
