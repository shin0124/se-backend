import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientController } from './patient.controller';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';

describe('PatientController', () => {
  let controller: PatientController;
  let service: PatientService;

  const mockPatients: Patient[] = [
    {
      id: 1,
      diaries: [],
      consults: [],
      events: [],
    },
    {
      id: 2,
      diaries: [],
      consults: [],
      events: [],
    },
  ];

  const mockPatient = {
    id: 3,
    name: 'Test Patient 3',
    address: 'address3',
    tel: 'tel3',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPatient),
            findAll: jest.fn().mockResolvedValue(mockPatients),
            findOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve(
                  mockPatients.find((patient) => patient.id === id),
                ),
              ),
            update: jest.fn().mockResolvedValue(mockPatient),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a patient', async () => {
      const createPatientDto: CreatePatientDto = {
        id: 3,
        name: 'Test Patient 3',
        address: 'address3',
        tel: 'tel3',
      };
      expect(await controller.create(createPatientDto)).toEqual(mockPatient);
      expect(service.create).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      expect(await controller.findAll()).toEqual(mockPatients);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      expect(await controller.findOne(1)).toEqual(mockPatients[0]);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if patient not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const updatePatientDto: UpdatePatientDto = { name: 'Updated Name' };
      expect(await controller.update(1, updatePatientDto)).toEqual(mockPatient);
      expect(service.update).toHaveBeenCalledWith(1, updatePatientDto);
    });
  });

  describe('remove', () => {
    it('should remove a patient', async () => {
      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
