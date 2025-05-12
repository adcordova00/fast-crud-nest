import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { OnboardingService } from './onboarding.service';
  import { CreateOnboardingDto } from './dto/create-onboarding.dto';
  
  @Controller('onboarding')
  export class OnboardingController {
    constructor(private readonly service: OnboardingService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateOnboardingDto) {
      return await this.service.create(dto);
    }
  
    @Get()
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
      return await this.service.findAll({ page: +page, limit: +limit });
    }
  
    @Get(':id')
    async findById(@Param('id') id: string) {
      return await this.service.findById(id);
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: Partial<CreateOnboardingDto>) {
      return await this.service.update(id, dto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softDelete(@Param('id') id: string) {
      await this.service.softDelete(id);
    }
  }
  