import { Type } from 'class-transformer';
import { IsElegible } from '../decorators';
import { ConsumptionHistoryDto } from '.';
import { CpfCnpjValidator } from '../validators';
import { 
    ConnectionTypeEnum, 
    ConsumptionClassEnum, 
    TariffModalityEnum 
} from '../enums';
import { 
    IsEnum, 
    IsNotEmpty, 
    IsString, 
    Validate, 
    ValidateNested
} from 'class-validator';

export class ClientDataDto {
    @IsString()
    @IsNotEmpty()
    @Validate(CpfCnpjValidator)
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
