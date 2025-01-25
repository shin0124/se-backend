import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SymtomPic } from './symtom-pic.entity';
import { CreateSymtomPicDto } from './dto/create-symtom-pic.dto';
import { UpdateSymtomPicDto } from './dto/update-symtom-pic.dto';

@Injectable()
export class SymtomPicService {
  constructor(
    @InjectRepository(SymtomPic)
    private symtomPicRepository: Repository<SymtomPic>,
  ) {}

  async create(createSymtomPicDto: CreateSymtomPicDto): Promise<SymtomPic> {
    const symtomPic = this.symtomPicRepository.create(createSymtomPicDto);
    return this.symtomPicRepository.save(symtomPic);
  }

  async findAll(): Promise<SymtomPic[]> {
    return this.symtomPicRepository.find({ relations: ['diary'] });
  }

  async findOne(id: number): Promise<SymtomPic | undefined> {
    return this.symtomPicRepository.findOne({
      where: { id },
      relations: ['diary'],
    });
  }

  async update(
    id: number,
    updateSymtomPicDto: UpdateSymtomPicDto,
  ): Promise<SymtomPic | undefined> {
    await this.symtomPicRepository.update(id, updateSymtomPicDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.symtomPicRepository.delete(id);
  }

  async findByDiaryId(diaryId: number): Promise<SymtomPic[]> {
    return this.symtomPicRepository.find({
      where: { diary: { id: diaryId } }, // Corrected filter: diary.id
      relations: ['diary'], // Keep the relations for consistency
    });
  }
}
