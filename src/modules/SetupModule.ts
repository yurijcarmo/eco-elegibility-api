import { Module } from '@nestjs/common';
import { DynamoDbClientModule } from '.';
import { SetupService } from '../services';

@Module({
    imports: [DynamoDbClientModule],
    providers: [SetupService],
    exports: [SetupService]
})
export class SetupModule {}
