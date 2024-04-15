import { Module } from '@nestjs/common';
import { 
  ClientDataModule,
  SetupModule 
} from './modules';

@Module({
  imports: [
    SetupModule,
    ClientDataModule
  ],
})
export class AppModule {}
