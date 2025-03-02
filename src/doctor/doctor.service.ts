import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  async findOne(email: string): Promise<Doctor> {
    if (email == null) {
      throw new Error('Doctor email must be emailed');
    }
    const doctor = await this.doctorRepository.findOne({ where: { email } });
    if (!doctor) {
      throw new Error(`Doctor with email ${email} not found`);
    }
    return doctor;
  }

  async update(
    email: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor | undefined> {
    await this.doctorRepository.update(email, updateDoctorDto);
    return this.findOne(email);
  }

  async remove(email: string): Promise<void> {
    await this.doctorRepository.delete(email);
  }
}
