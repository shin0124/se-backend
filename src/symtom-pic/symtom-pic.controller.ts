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
import { SymtomPicService } from './symptom-pic.service';
import { CreateSymtomPicDto } from './dto/create-symtom-pic.dto';
import { UpdateSymtomPicDto } from './dto/update-symtom-pic.dto';

@Controller('symptom-pics')
export class SymtomPicController {
  constructor(private readonly symtomPicService: SymtomPicService) {}

  @Post()
  create(@Body() createSymtomPicDto: CreateSymtomPicDto) {
    return this.symtomPicService.create(createSymtomPicDto);
  }

  @Get()
  findAll() {
    return this.symtomPicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.symtomPicService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSymtomPicDto: UpdateSymtomPicDto,
  ) {
    return this.symtomPicService.update(id, updateSymtomPicDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.symtomPicService.remove(id);
  }
  @Get('diary/:diaryId')
  findByDiaryId(@Param('diaryId', ParseIntPipe) diaryId: number) {
    return this.symtomPicService.findByDiaryId(diaryId);
  }
}
