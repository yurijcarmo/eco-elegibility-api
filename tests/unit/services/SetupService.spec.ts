import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SetupModule } from '../../../src/modules';
import { SetupService } from '../../../src/services';
import {
    Test,
    TestingModule
} from "@nestjs/testing";
import {
    CreateTableCommand,
    DynamoDBClient,
    ListTablesCommand
} from "@aws-sdk/client-dynamodb";


describe('SetupService', () => {
    let service: SetupService;
    let mockDocumentClient: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SetupModule],
        }).compile();

        service = module.get<SetupService>(SetupService);
        const mockDynamoDBClient = new DynamoDBClient();
        mockDocumentClient = DynamoDBDocumentClient.from(mockDynamoDBClient);
        service['dynamoDbClient'] = mockDocumentClient;
        mockDocumentClient.send = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new table when it does not already exist', async () => {
        mockDocumentClient.send
            .mockResolvedValueOnce({ TableNames: [] })
            .mockResolvedValueOnce({
                TableDescription: {
                    TableName: process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY
                }
            });

        await service.onModuleInit();
        expect(mockDocumentClient.send).toHaveBeenCalledTimes(2);
        expect(mockDocumentClient.send).toHaveBeenCalledWith(
            expect.any(ListTablesCommand)
        );
        expect(mockDocumentClient.send).toHaveBeenCalledWith(
            expect.any(CreateTableCommand)
        );
    });

    it('should handle errors during the initial table check process', async () => {
        const errorMessage = 'Error Test';

        mockDocumentClient.send.mockRejectedValueOnce(new Error(errorMessage));

        await service.onModuleInit().catch((error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual(errorMessage);
            expect(mockDocumentClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocumentClient.send).toHaveBeenCalledWith(
                expect.any(ListTablesCommand)
            );
            expect(mockDocumentClient.send).not.toHaveBeenCalledWith(
                expect.any(CreateTableCommand)
            );
        });
    });

    it('should not create a table if it already exists', async () => {
        mockDocumentClient.send.mockResolvedValueOnce({
            TableNames: [
                process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY
            ]
        });
        await service.onModuleInit();

        expect(mockDocumentClient.send).toHaveBeenCalledTimes(1);
        expect(mockDocumentClient.send).toHaveBeenCalledWith(
            expect.any(ListTablesCommand)
        );
        expect(mockDocumentClient.send).not.toHaveBeenCalledWith(
            expect.any(CreateTableCommand)
        );
    });

    it('should handle errors during the table creation process', async () => {
        const errorMessage = 'Error Test';

        mockDocumentClient.send
            .mockResolvedValueOnce({ TableNames: [] })
            .mockRejectedValueOnce(new Error(errorMessage));

        await service.onModuleInit().catch((error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual(errorMessage);
            expect(mockDocumentClient.send).toHaveBeenCalledTimes(2);
            expect(mockDocumentClient.send).toHaveBeenCalledWith(
                expect.any(ListTablesCommand)
            );
            expect(mockDocumentClient.send).toHaveBeenCalledWith(
                expect.any(CreateTableCommand)
            );
        });
    });
});
