import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  findAll() {
    // แค่ return ข้อความหรือ array
    return [
      { id: 1, name: 'Anuchit' },
      { id: 2, name: 'Mochi' },
    ];
  }
}
