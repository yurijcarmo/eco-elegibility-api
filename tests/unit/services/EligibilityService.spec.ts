import { ConnectionTypeEnum } from '../../../src/enums';
import { EligibilityService } from '../../../src/services';
import { EligibilityModule } from '../../../src/modules';
import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    EligibleResponseModel,
    IneligibleResponseModel
} from '../../../src/models';

import * as utils from '../../../src/utils';

jest.mock('../../../src/utils');

describe('EligibilityService', () => {
    let service: EligibilityService;
    let mockCalculateAverageConsumption: jest.MockedFunction<
        typeof utils.calculateAverageConsumption
    >;
    let mockCalculateAnnualCo2Emissions: jest.MockedFunction<
        typeof utils.calculateAnnualCo2Emissions
    >;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EligibilityModule],
        }).compile();

        service = module.get<EligibilityService>(EligibilityService);

        mockCalculateAverageConsumption = utils
            .calculateAverageConsumption as jest.MockedFunction<
                typeof utils.calculateAverageConsumption
            >;

        mockCalculateAnnualCo2Emissions = utils
            .calculateAnnualCo2Emissions as jest.MockedFunction<
                typeof utils.calculateAnnualCo2Emissions
            >;

        mockCalculateAverageConsumption.mockReturnValue(500);
        mockCalculateAnnualCo2Emissions.mockReturnValue(42);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return an eligible response when consumption meets '
        + 'the requirements', () => {
            const result = service.checkConsumptionEligibility(
                [450, 450, 450],
                ConnectionTypeEnum.SINGLEPHASE
            );
            expect(result).toBeInstanceOf(EligibleResponseModel);
        });

    it('should return an ineligible response when consumption is '
        + 'below the minimum required', () => {
            mockCalculateAverageConsumption.mockReturnValue(300);
            const result = service.checkConsumptionEligibility(
                [300, 300, 300],
                ConnectionTypeEnum.SINGLEPHASE
            );
            expect(result).toBeInstanceOf(IneligibleResponseModel);
        });

    it('should handle unexpected connection types correctly', () => {
        mockCalculateAverageConsumption.mockReturnValue(1000);
        const result = service.checkConsumptionEligibility(
            [1000, 1000, 1000],
            ConnectionTypeEnum.TRIPHASE
        );
        expect(result).toBeInstanceOf(EligibleResponseModel);
    });

    it('should return an eligible response for BIPHASE connection when '
        + 'consumption is above the threshold', () => {
            mockCalculateAverageConsumption.mockReturnValue(600);
            const result = service.checkConsumptionEligibility(
                [600, 600, 600],
                ConnectionTypeEnum.BIPHASE
            );
            expect(result).toBeInstanceOf(EligibleResponseModel);
        });

    it('should return an ineligible response for BIPHASE connection when '
        + 'consumption is below the threshold', () => {
            mockCalculateAverageConsumption.mockReturnValue(400);
            const result = service.checkConsumptionEligibility(
                [400, 400, 400],
                ConnectionTypeEnum.BIPHASE
            );
            expect(result).toBeInstanceOf(IneligibleResponseModel);
        });

    it('should handle other connection types with default behavior', () => {
        mockCalculateAverageConsumption.mockReturnValue(5000)
        const result = service.checkConsumptionEligibility(
            [5000, 5000, 5000],
            ConnectionTypeEnum.OTHER
        );
        expect(result).toBeInstanceOf(IneligibleResponseModel);
    });
});
