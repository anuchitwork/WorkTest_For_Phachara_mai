import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags,ApiOkResponse,ApiParam } from '@nestjs/swagger';
import { Injectable, Logger } from '@nestjs/common';


@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }




  @Get('many/:ids')
  @ApiParam({ name: 'ids', required: true, type: String, example: '1,2,3,4,5' }) // <-- ใช้ ApiParam แทน ApiQuery
  @ApiQuery({ name: 'take', required: false, type: Number, example: 5 })
  @ApiQuery({ name: 'type', required: false, type: String, example: 'next' })
  async findMany(
    @Param('ids') idsParam: string,
    @Query('take') take = 5,
    @Query('type') type: 'next' | 'back' = 'next',
  ) {
    const idArray = idsParam
      ? idsParam.split(',').map(n => Number(n)).filter(n => !isNaN(n))
      : [];
    // this.logger.log(`Fetching users with IDs: ${idArray}, take: ${take}, type: ${type}`);
    return this.usersService.findMany(idArray, Number(take), type);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.usersService.remove(+id);
    }

}
