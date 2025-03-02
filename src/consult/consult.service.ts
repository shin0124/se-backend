import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consult } from './consult.entity';
import { CreateConsultDto } from './dto/create-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';

@Injectable()
export class ConsultService {
  constructor(
    @InjectRepository(Consult)
    private consultRepository: Repository<Consult>,
  ) {}

  async create(createConsultDto: CreateConsultDto): Promise<Consult> {
    const consult = this.consultRepository.create(createConsultDto);
    return this.consultRepository.save(consult);
  }

  async findAll(): Promise<Consult[]> {
    return this.consultRepository.find({ relations: ['patient'] }); // Eager load patient
  }

  async findOne(id: number): Promise<Consult | undefined> {
    return this.consultRepository.findOne({
      where: { id },
      relations: ['patient'],
    }); // Eager load patient
  }

  async findByPatientId(patientId: string): Promise<Consult[]> {
    return this.consultRepository.find({
      where: {
        patient: { id: patientId },
      },
      relations: ['patient'],
    });
  }

  async update(
    id: number,
    updateConsultDto: UpdateConsultDto,
  ): Promise<Consult | undefined> {
    await this.consultRepository.update(id, updateConsultDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.consultRepository.delete(id);
  }
}
