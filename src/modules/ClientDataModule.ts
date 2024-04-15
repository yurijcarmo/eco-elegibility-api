import { ClientDataController } from '../controllers';
import { ClientDataRepository } from '../repositories';
import { ClientDataService } from '../services';
import { 
  Module, 
  forwardRef 
} from '@nestjs/common';
import { 
  DynamoDbClientModule, 
  EligibilityModule 
} from '.';

@Module({
  imports: [
    forwardRef(() => DynamoDbClientModule),
    forwardRef(() => EligibilityModule), 
  ],
  controllers: [ClientDataController],
  providers: [
    ClientDataRepository,
    ClientDataService
  ],
  exports: [
    ClientDataRepository,
    ClientDataService,
  ]
})
export class ClientDataModule { }
