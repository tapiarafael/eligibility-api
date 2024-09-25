import { Module } from '@nestjs/common';
import { EligibilityController } from './eligibility/eligibility.controller';
import { EligibilityService } from './eligibility/eligibility.service';

@Module({
  imports: [],
  controllers: [EligibilityController],
  providers: [EligibilityService],
})
export class AppModule {}
