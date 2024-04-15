import { Module } from '@nestjs/common';
import { EligibilityService } from '../services';

@Module({
  providers: [EligibilityService],
  exports: [EligibilityService],
})
export class EligibilityModule {}
