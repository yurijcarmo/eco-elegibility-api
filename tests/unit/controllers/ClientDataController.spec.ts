
import { ClientDataController } from '../../../src/controllers';
import { ClientDataDto } from '../../../src/dtos';
import { ClientDataService } from '../../../src/services';
import { 
    Test, 
    TestingModule 
} from '@nestjs/testing';
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

describe('ClientDataController (unit)', () => {
    let controller: ClientDataController;
    let service: jest.Mocked<ClientDataService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientDataController],
            providers: [
                {
                    provide: ClientDataService,
                    useValue: {
                        handleClientEligibility: jest.fn(),
                        getClientData: jest.fn()
                    },
                },
            ],
        }).compile();

        controller = module.get<ClientDataController>(ClientDataController);
        service = module.get(ClientDataService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('evaluateClientEligibility', () => {
        it('should return EligibleResponseModel for eligible client', async () => {
            const clientData: ClientDataDto = {
                documentNumber: '29019339044',
                connectionType: ConnectionTypeEnum.BIPHASE,
                consumptionHistory: {
                    values: [400, 500, 600]
                },
                consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
                tariffModality: TariffModalityEnum.GREEN
            };

            const eligibleResponse = new EligibleResponseModel(500);
            service.handleClientEligibility.mockResolvedValue(eligibleResponse);

            const result = await controller.handleClientEligibility(clientData);
            expect(result).toEqual(eligibleResponse);
            expect(service.handleClientEligibility).toHaveBeenCalledWith(clientData);
        });

        it('should return IneligibleResponseModel for ineligible client', async () => {
            const clientData: ClientDataDto = {
                documentNumber: '72639218000100',
                connectionType: ConnectionTypeEnum.TRIPHASE,
                consumptionHistory: {
                    values: [100, 200, 300]
                },
                consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
                tariffModality: TariffModalityEnum.GREEN
            };

            const ineligibleResponse = new IneligibleResponseModel([
                IneligibilityReasonEnum.LOW_CONSUMPTION_FOR_TYPE
            ]);
            service.handleClientEligibility.mockResolvedValue(ineligibleResponse);

            const result = await controller.handleClientEligibility(clientData);
            expect(result).toEqual(ineligibleResponse);
            expect(service.handleClientEligibility).toHaveBeenCalledWith(clientData);
        });
    });

    describe('getPerson', () => {
        it('should retrieve client data', async () => {
            const documentNumber = '72639218000100';
            const clientData: ClientDataModel = {
                documentNumber: documentNumber,
                connectionType: ConnectionTypeEnum.BIPHASE,
                consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
                tariffModality: TariffModalityEnum.GREEN,
                consumptionHistory: {
                    values: [100, 200, 300]
                }
            };

            service.getClientData.mockResolvedValue(clientData);

            const result = await controller.getPerson(documentNumber);
            expect(result).toEqual(clientData);
            expect(service.getClientData).toHaveBeenCalledWith(documentNumber);
        });
    });
});
