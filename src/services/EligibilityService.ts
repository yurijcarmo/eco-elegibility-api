import {
    ConnectionTypeEnum,
    IneligibilityReasonEnum
} from '../enums';
import {
    Injectable
} from '@nestjs/common';
import {
    calculateAnnualCo2Emissions,
    calculateAverageConsumption
} from '../utils';
import {
    EligibleResponseModel,
    IneligibleResponseModel
} from '../models';

@Injectable()
export class EligibilityService {
    constructor() { }

    checkConsumptionEligibility(
        consumptionHistoryValues: number[],
        connectionType: ConnectionTypeEnum
    ): EligibleResponseModel | IneligibleResponseModel {

        const averageConsumption = calculateAverageConsumption(
            consumptionHistoryValues
        );
        const minimumConsumption = this.getMinimumConsumption(
            connectionType
        );
        if (averageConsumption < minimumConsumption) {
            return this.ineligibleResponse([
                IneligibilityReasonEnum.LOW_CONSUMPTION_FOR_TYPE
            ]);
        }
        const co2Savings = calculateAnnualCo2Emissions(
            averageConsumption
        );

        return this.eligibleResponse(
            co2Savings
        );
    }

    private getMinimumConsumption(
        connectionType: ConnectionTypeEnum
    ): number {
        switch (connectionType) {
            case ConnectionTypeEnum.SINGLEPHASE:
                return 400;
            case ConnectionTypeEnum.BIPHASE:
                return 500;
            case ConnectionTypeEnum.TRIPHASE:
                return 750;
            default:
                return Infinity;
        }
    }

    private ineligibleResponse(reasons: IneligibilityReasonEnum[])
        : IneligibleResponseModel {
        return new IneligibleResponseModel(reasons);
    }

    private eligibleResponse(co2Savings: number): EligibleResponseModel {
        return new EligibleResponseModel(co2Savings);
    }
}
