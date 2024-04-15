import { Type } from 'class-transformer';
import { IsElegible } from '../decorators';
import { ConsumptionHistoryDto } from '.';
import { 
    ConnectionTypeEnum, 
    ConsumptionClassEnum, 
    TariffModalityEnum 
} from '../enums';
import { 
    IsEnum, 
    IsNotEmpty, 
    IsString, 
    ValidateNested, 
    Matches 
} from 'class-validator';

export class ClientDataDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$|^\d{14}$/, { 
        message: 'The document number must be a valid CPF with 11 digits '
        + 'or a valid CNPJ with 14 digits' 
    })
    documentNumber: string;

    @IsNotEmpty()
    @IsEnum(
        ConnectionTypeEnum, 
        { message: 'Invalid or missing connection type' }
    )
    connectionType: ConnectionTypeEnum;

    @IsNotEmpty()
    @IsElegible(
        ConsumptionClassEnum, 
        { message: 'Invalid or missing consumption class' }
    )
    consumptionClass: ConsumptionClassEnum;

    @IsNotEmpty()
    @IsElegible(
        TariffModalityEnum, 
        { message: 'Invalid or missing tariff modality' }
    )
    tariffModality: TariffModalityEnum;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ConsumptionHistoryDto)
    consumptionHistory: ConsumptionHistoryDto;
}
