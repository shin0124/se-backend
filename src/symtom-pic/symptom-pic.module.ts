import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymtomPicService } from './symptom-pic.service';
import { SymtomPicController } from './symtom-pic.controller';
import { SymtomPic } from './symtom-pic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SymtomPic])],
  providers: [SymtomPicService],
  controllers: [SymtomPicController],
  exports: [SymtomPicService],
})
export class SymtomPicModule {}
