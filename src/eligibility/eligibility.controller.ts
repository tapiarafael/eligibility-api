import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  CheckEligibilityRequest,
  CheckEligibilityResponse,
} from './types/check-eligibility';
import { EligibilityService } from './eligibility.service';

@Controller('eligibility')
export class EligibilityController {
  constructor(private eligibilityService: EligibilityService) {}

  @Post('check')
  @HttpCode(200)
  check(@Body() body: CheckEligibilityRequest): CheckEligibilityResponse {
    return this.eligibilityService.check(body);
  }
}
