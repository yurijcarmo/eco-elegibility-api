import { 
    ConsumptionHistoryModel, 
    EligibleResponseModel, 
    IneligibleResponseModel
} from '.';
import { 
    ConnectionTypeEnum,
    ConsumptionClassEnum, 
    TariffModalityEnum 
} from '../enums';

export class ClientDataModel {

    documentNumber: string;

    connectionType: ConnectionTypeEnum;

    consumptionClass: ConsumptionClassEnum;

    tariffModality: TariffModalityEnum;

    consumptionHistory: ConsumptionHistoryModel;

    eligibilityDetails?: EligibleResponseModel | IneligibleResponseModel;
}
