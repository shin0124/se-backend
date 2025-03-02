import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ConsultService } from './consult.service';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';

@Controller('consults')
export class ConsultController {
  constructor(private readonly consultService: ConsultService) {}

  @Post()
  create(@Body() createConsultDto: CreateConsultDto) {
    return this.consultService.create(createConsultDto);
  }

  @Get()
  findAll() {
    return this.consultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultService.findOne(id);
  }

  @Get('patient/:patientId')
  findByPatientId(@Param('patientId', ParseIntPipe) patientId: string) {
    return this.consultService.findByPatientId(patientId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsultDto: UpdateConsultDto,
  ) {
    return this.consultService.update(id, updateConsultDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultService.remove(id);
  }
}
