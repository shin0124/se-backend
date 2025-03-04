import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import 'dotenv/config';

@Injectable()
export class PatientService {
  private readonly API_URL = process.env.CLINIC_API_URL + '/patients';

  constructor(private readonly httpService: HttpService) {}

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.post(`${this.API_URL}`, createPatientDto),
    );
    return response.data;
  }

  async findAll(): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.API_URL}`),
    );
    return response.data;
  }

  async findOneByCitizenID(citizenID: string): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.API_URL}`, { params: { citizenID } }),
    );
    return response.data;
  }

  async update(
    citizenID: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<any> {
    const body = {
      citizenID,
      ...updatePatientDto,
    };
    const response = await lastValueFrom(
      this.httpService.put(`${this.API_URL}`, body),
    );
    return response.data;
  }
}
