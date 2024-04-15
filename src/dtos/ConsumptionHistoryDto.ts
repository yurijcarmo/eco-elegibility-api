import { 
    IsInt, 
    Min, 
    Max, 
    ArrayNotEmpty, 
    IsArray, 
    ArrayMinSize, 
    ArrayMaxSize
} from 'class-validator';

export class ConsumptionHistoryDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(3)
    @ArrayMaxSize(12)
    @IsInt({
        each: true
    })
    @Min(0, {
        each: true
    })
    @Max(9999, {
        each: true
    })
    values: number[];
}
