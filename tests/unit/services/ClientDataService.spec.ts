import { ClientDataModule } from '../../../src/modules';
import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    ClientDataService
} from '../../../src/services';
import {
    ConnectionTypeEnum,
    ConsumptionClassEnum,
    IneligibilityReasonEnum,
    TariffModalityEnum
} from '../../../src/enums';
import {
    ClientDataModel,
    EligibleResponseModel,
    IneligibleResponseModel
} from '../../../src/models';

import * as utils from "../../../src/utils";
import { 
    BadRequestException, 
    NotFoundException 
} from '@nestjs/common';

jest.mock('../../../src/utils');

jest.spyOn(utils, 'calculateAverageConsumption').mockReturnValue(500);
jest.spyOn(utils, 'calculateAnnualCo2Emissions').mockReturnValue(42);

jest.mock('../../../src/repositories/ClientDataRepository');

describe('ClientDataService', () => {
    let service: ClientDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientDataModule
            ],
        }).compile();

        service = module.get<ClientDataService>(ClientDataService);
    });

    const mockClientData: ClientDataModel = {
        consumptionHistory: {
            values: [100, 200, 300]
        },
        connectionType: ConnectionTypeEnum.SINGLEPHASE,
        documentNumber: '',
        consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
        tariffModality: TariffModalityEnum.GREEN
    };

    it('should evaluate eligibility correctly for eligible client', async () => {
        const clientData = mockClientData;
        const annualCo2Savings = 500;
        const eligibleResponse = new EligibleResponseModel(annualCo2Savings);

        const checkConsumptionEligibilitySpyOn = jest.spyOn(
            service['eligibilityService'], 
            'checkConsumptionEligibility'
        )

        checkConsumptionEligibilitySpyOn
            .mockReturnValueOnce(eligibleResponse);

        const putClientDataSpyOn = jest.spyOn(
            service['clientDataRepository'],
            'putClientData'
        );
        putClientDataSpyOn.mockResolvedValueOnce(clientData);

        const result = await service.handleClientEligibility(clientData);

        expect(result).toBeInstanceOf(EligibleResponseModel);
        expect(result).toEqual(eligibleResponse);

        expect(putClientDataSpyOn).toHaveBeenCalledWith(
            {
                ...clientData,
                eligibilityDetails: eligibleResponse
            }
        );

        expect(checkConsumptionEligibilitySpyOn)
            .toHaveBeenCalledWith(
                clientData.consumptionHistory.values,
                clientData.connectionType
            );
    });

    it('should evaluate eligibility correctly for ineligible client', async () => {
        const clientData = mockClientData;
        const ineligibleReasons = [
            IneligibilityReasonEnum.LOW_CONSUMPTION_FOR_TYPE
        ];
        const ineligibleResponse = new IneligibleResponseModel(ineligibleReasons);

        const checkConsumptionEligibilitySpyOn = jest.spyOn(
            service['eligibilityService'],
            'checkConsumptionEligibility'
        );

        const putClientDataSpyOn = jest.spyOn(
            service['clientDataRepository'],
            'putClientData'
        );
        putClientDataSpyOn.mockResolvedValueOnce(clientData);

        checkConsumptionEligibilitySpyOn.mockReturnValueOnce(ineligibleResponse);

        const result = await service.handleClientEligibility(clientData);

        expect(result).toBeInstanceOf(IneligibleResponseModel);
        expect(result).toEqual(ineligibleResponse);

        expect(putClientDataSpyOn).toHaveBeenCalledWith(
            {
                ...clientData,
                eligibilityDetails: ineligibleResponse
            }
        );

        expect(checkConsumptionEligibilitySpyOn)
            .toHaveBeenCalledWith(
                clientData.consumptionHistory.values,
                clientData.connectionType
            );
    });

    it('should throw BadRequestException on internal error', async () => {
        const clientData = mockClientData;
        const errorMessage = 'Internal server error';

        const checkConsumptionEligibilitySpyOn = jest.spyOn(
            service['eligibilityService'],
            'checkConsumptionEligibility'
        );

       checkConsumptionEligibilitySpyOn
            .mockImplementation(() => {
                throw new Error(errorMessage);
            });

        const handleClientEligibilitySpyOn = service.handleClientEligibility(
            clientData
        );

        await expect(handleClientEligibilitySpyOn)
            .rejects.toThrow(BadRequestException);

        await expect(handleClientEligibilitySpyOn)
            .rejects.toThrow(
                `Error evaluating client: ${errorMessage}`
            );
    });

    it('should get client data by document number', async () => {
        const documentNumber = '123456789';
        const expectedClientData: ClientDataModel = {
            ...mockClientData,
            documentNumber
        };

        const getClientDataSpyOn = jest.spyOn(
            service['clientDataRepository'], 
            'getClientData'
        );

        getClientDataSpyOn.mockResolvedValueOnce(expectedClientData);

        const result = await service.getClientData(documentNumber);

        expect(result).toEqual(expectedClientData);

        expect(getClientDataSpyOn).toHaveBeenCalledWith(documentNumber);
    });

    it('should throw NotFoundException if client data not found', async () => {
        const documentNumber = '123456789';

        const getClientDataSpyOn = jest.spyOn(
            service['clientDataRepository'], 
            'getClientData'
        );

        getClientDataSpyOn.mockResolvedValueOnce(null);

        await expect(service.getClientData(documentNumber))
            .rejects
            .toThrow(NotFoundException);

        expect(getClientDataSpyOn).toHaveBeenCalledWith(documentNumber);
    });

    it('should throw BadRequestException on internal error', async () => {
        const clientData = mockClientData;
        const errorMessage = 'Internal server error';
    
        const putClientDataSpyOn = jest.spyOn(
            service['clientDataRepository'],
            'putClientData'
        );
        putClientDataSpyOn.mockImplementation(() => {
            throw new Error(errorMessage);
        });
    
        const handleClientEligibilityCall = async () => {
            await service.handleClientEligibility(clientData);
        };
    
        await expect(handleClientEligibilityCall)
            .rejects.toThrow(BadRequestException);
    
        await expect(handleClientEligibilityCall)
            .rejects.toThrow(
                `Error evaluating client: ${errorMessage}`
            );
    });
    
});
