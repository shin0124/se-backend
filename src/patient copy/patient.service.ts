// src/patients/patient.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Patient } from './patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  // Find a patient by citizenID
  async findByCitizenID(citizenID: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { citizenID },
    });
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  // Find a patient by first and last name
  async findByName(firstName: string, lastName: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { firstName, lastName },
    });
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  // Find a patient by HN (Hospital Number)
  async findByHN(HN: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { HN },
    });
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  // Create a new patient
  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const hashedPassword = await bcrypt.hash(createPatientDto.password, 10);
    const patient = this.patientRepository.create({
      ...createPatientDto,
      password: hashedPassword,
    });
    try {
      await this.patientRepository.save(patient);
      return patient;
    } catch (error) {
      throw new Error('Failed to create patient: ' + error);
    }
  }

  // Login method for patient
  async login(citizenID: string, password: string): Promise<any> {
    const patient = await this.patientRepository.findOne({
      where: { citizenID },
    });
    if (patient && (await bcrypt.compare(password, patient.password))) {
      return { message: 'Login successful', patient };
    }
    return { error: 'Invalid citizenID or password' };
  }

  // Update patient information
  async updatePatient(updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const { citizenID, ...updateData } = updatePatientDto;
    const patient = await this.patientRepository.findOne({
      where: { citizenID },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    await this.patientRepository.update(citizenID, updateData);
    return { ...patient, ...updateData };
  }

  // Change patient password
  async changePassword(
    citizenID: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    const patient = await this.patientRepository.findOne({
      where: { citizenID },
    });
    if (!patient) {
      return { error: 'Patient not found' };
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      patient.password,
    );
    if (passwordMatch) {
      patient.password = await bcrypt.hash(newPassword, 10);
      await this.patientRepository.save(patient);
      return { message: 'Password updated successfully' };
    }

    return { error: 'Current password is incorrect' };
  }
}
