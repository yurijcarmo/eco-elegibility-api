import { ClientDataService } from '../services';
import { ClientDataDto } from '../dtos';
import { ValidateDocNumPipe } from '../pipes';
import { 
  ClientDataModel,
  EligibleResponseModel, 
  IneligibleResponseModel 
} from '../models';
import { 
  Controller, 
  Post, 
  Body, 
  Get,
  Query
} from '@nestjs/common';

@Controller()
export class ClientDataController {
  constructor(private readonly clientDataService: ClientDataService) { }

  @Post('client')
  async handleClientEligibility(@Body() clientData: ClientDataDto)
    : Promise<EligibleResponseModel | IneligibleResponseModel> {
    return this.clientDataService.handleClientEligibility(
      clientData
    );
  }

  @Get('client')
  async getPerson(
    @Query('documentNumber', ValidateDocNumPipe) documentNumber: string
  ): Promise<ClientDataModel> {
    return this.clientDataService.getClientData(documentNumber);
  }
}
