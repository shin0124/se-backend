import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consult } from './consult.entity';
import { ConsultService } from './consult.service';
import { ConsultController } from './consult.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consult])],
  providers: [ConsultService],
  controllers: [ConsultController],
  exports: [ConsultService],
})
export class ConsultModule {}
