import { ClientDataRepository } from '../repositories';
import { EligibilityService } from '.';
import { 
    Injectable, 
    Inject, 
    forwardRef, 
    BadRequestException, 
    NotFoundException 
} from '@nestjs/common';
import { 
    ClientDataModel, 
    EligibleResponseModel, 
    IneligibleResponseModel 
} from '../models';

@Injectable()
export class ClientDataService {
    constructor(
        private readonly clientDataRepository: ClientDataRepository,
        @Inject(forwardRef(() => EligibilityService))
        private readonly eligibilityService: EligibilityService
    ) { }

    async handleClientEligibility(clientData: ClientDataModel)
        : Promise<EligibleResponseModel | IneligibleResponseModel> {
        try {
            const { values: consumptionHistoryValues } = clientData.consumptionHistory;
            const { connectionType } = clientData;

            const eligibilityResult = this.eligibilityService
                .checkConsumptionEligibility(
                    consumptionHistoryValues,
                    connectionType
                );

            clientData.eligibilityDetails = eligibilityResult;
            await this.recordClientData(clientData);
            return eligibilityResult;

        } catch (error) {
            throw new BadRequestException(
                `Error evaluating client: ${error.message}`
            );
        }
    }

    async getClientData(documentNumber: string): Promise<ClientDataModel> {
        const clientData = await this.clientDataRepository
            .getClientData(documentNumber);

        if (!clientData) {
            throw new NotFoundException(
                `The document number: '${documentNumber}' `
                + 'was not found in our database.'
            );
        }
        return clientData;
    }

    private async recordClientData(clientData: ClientDataModel)
        : Promise<ClientDataModel> {
        return this.clientDataRepository.putClientData(clientData);
    }
}
