import { Module } from '@nestjs/common';
import { DynamoDbClientService } from '../services';

@Module({
  providers: [DynamoDbClientService],
  exports: [DynamoDbClientService],
})
export class DynamoDbClientModule {}
