import { ClientDataDto } from '../../src/dtos';
import { 
    ConnectionTypeEnum, 
    ConsumptionClassEnum, 
    IneligibilityReasonEnum, 
    TariffModalityEnum 
} from '../../src/enums';

export class ClientDataServiceMock {
    handleClientEligibility(clientData: ClientDataDto) {
        const connectionType = clientData.connectionType;
        return connectionType === ConnectionTypeEnum.BIPHASE
            ? { eligible: true, co2Savings: 444 }
            : {
                eligible: false, reasons: [
                    IneligibilityReasonEnum.CONSUMPTION_CLASS_NOT_ACCEPTED
                ]
            };
    }

    getClientData(documentNumber: string) {
        return {
            documentNumber,
            connectionType: ConnectionTypeEnum.BIPHASE,
            consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
            tariffModality: TariffModalityEnum.GREEN,
            co2Savings: 444
        };
    }
}
