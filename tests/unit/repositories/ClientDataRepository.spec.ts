import { ClientDataRepository } from '../../../src/repositories';
import { DynamoDbClientService } from '../../../src/services';
import { ClientDataModel } from '../../../src/models';
import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    ConnectionTypeEnum,
    ConsumptionClassEnum,
    TariffModalityEnum
} from '../../../src/enums';
import { NotFoundException } from '@nestjs/common';

describe('ClientDataRepository', () => {
    let repository: ClientDataRepository;
    let dynamoDbClientService: DynamoDbClientService;
    let dynamoDbClient: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClientDataRepository, DynamoDbClientService],
        }).compile();

        repository = module.get<ClientDataRepository>(ClientDataRepository);
        dynamoDbClientService = module.get<DynamoDbClientService>(DynamoDbClientService);
        dynamoDbClient = dynamoDbClientService.getDocumentClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const clientDataMock: ClientDataModel = {
        documentNumber: '46909507096',
        connectionType: ConnectionTypeEnum.BIPHASE,
        consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
        tariffModality: TariffModalityEnum.GREEN,
        consumptionHistory: {
            values: [500, 600, 700],
        },
    };

    describe('putClientData', () => {
        it('should put client data into DynamoDB', async () => {
            jest.spyOn(dynamoDbClient, 'send').mockResolvedValue({ 
                Item: clientDataMock 
            });
            const result = await repository.putClientData(clientDataMock);
            expect(result).toEqual(clientDataMock);
        });

        it('should throw an error if failed to put client data into DynamoDB',
            async () => {
                const errorMessage = 'Failed to put client data';
                jest.spyOn(dynamoDbClient, 'send').mockRejectedValueOnce(
                    new Error(errorMessage)
                );

                await repository.putClientData(clientDataMock)
                    .catch((error) => {
                        expect(error).toBeInstanceOf(Error);
                        expect(error.message).toEqual(
                            `Failed to update client data: ${errorMessage}`
                        );
                    })
            });
    });

    describe('getClientData', () => {
        it('should get client data from DynamoDB', async () => {
            const documentNumber = clientDataMock.documentNumber;
            jest.spyOn(dynamoDbClient, 'send').mockResolvedValueOnce({ 
                Item: clientDataMock 
            });
            const result = await repository.getClientData(documentNumber);
            expect(result).toEqual(clientDataMock);
        });

        it('should throw an error if client data not found in DynamoDB',
            async () => {
                const documentNumber = clientDataMock.documentNumber;

                jest.spyOn(dynamoDbClient, 'send').mockResolvedValueOnce(
                    {
                        '$metadata': {
                          httpStatusCode: 200,
                          requestId: '92a05f73-85ed-4da2-a532-b087b2d23305',
                          extendedRequestId: undefined,
                          cfId: undefined,
                          attempts: 1,
                          totalRetryDelay: 0
                        }
                      }
                );

                const errorMessage = 'No item found for document number: '
                + documentNumber;

                await repository.getClientData(
                    documentNumber
                ).catch((error) => {
                    expect(error).toBeInstanceOf(NotFoundException);
                    expect(error.message).toEqual(
                        `Failed to retrieve client data: ${errorMessage}`
                    );
                })
            });

        it('should throw an error if failed to get client data from DynamoDB',
            async () => {
                const documentNumber = clientDataMock.documentNumber;

                const errorMessage = 'Error Test';

                jest.spyOn(dynamoDbClient, 'send').mockRejectedValueOnce(
                   new Error(errorMessage)
                );

                await repository.getClientData(
                    documentNumber
                ).catch((error) => {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toEqual(
                        `Failed to retrieve client data: ${errorMessage}`
                    );
                })
        });
    });
});