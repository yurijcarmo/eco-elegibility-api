import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDbClientService } from '../../../src/services';
import { SmithyResolvedConfiguration } from '@smithy/smithy-client';
import { HttpHandlerOptions } from '@smithy/types';
import { 
    AwsStub, 
    mockClient 
} from 'aws-sdk-client-mock';
import { 
    DynamoDBClient, 
    ServiceInputTypes, 
    ServiceOutputTypes 
} from '@aws-sdk/client-dynamodb';

describe('DynamoDbClientService (unit)', () => {
    let service: DynamoDbClientService;
    let dynamoMock: AwsStub<
        ServiceInputTypes,
        ServiceOutputTypes,
        SmithyResolvedConfiguration<HttpHandlerOptions>
    >;

    beforeEach(() => {
        process.env.ENVIRONMENT = 'dev.server';
        dynamoMock = mockClient(DynamoDBClient);
        mockClient(DynamoDBDocumentClient).resolves({});
        service = new DynamoDbClientService();
    });

    afterEach(() => {
        dynamoMock.restore();
        jest.restoreAllMocks();
    });

    it('should initialize DynamoDB clients successfully', () => {
        expect(() => service.onModuleInit()).not.toThrow();
    });

    it('should throw an error if DynamoDB clients are not initialized', () => {
        DynamoDbClientService['baseClient'] = null;
        DynamoDbClientService['documentClient'] = null;

        expect(() => service.onModuleInit()).toThrow(
            "DynamoDB clients are not initialized."
        );
    });

    it('should return base client', () => {
        const baseClient = service.getBaseClient();
        expect(baseClient).toBeInstanceOf(DynamoDBClient);
    });

    it('should configure for local development correctly', async () => {
        process.env.ENVIRONMENT = 'dev.server';
        service = new DynamoDbClientService();

        const endpointConfig = DynamoDbClientService['baseClient'].config.endpoint;
        if (typeof endpointConfig === 'function') {
            const actualEndpoint = endpointConfig();
            expect((await actualEndpoint).hostname).toEqual('dynamodb-local');
            expect((await actualEndpoint).port).toEqual(8000);
        } else {
            expect(endpointConfig).toEqual('http://dynamodb-local:8000');
        }
    });

    it('should configure for production correctly', () => {
        process.env.ENVIRONMENT = 'prod.server';
        service = new DynamoDbClientService();

        const endpointFunction = DynamoDbClientService['baseClient']
            .config.endpoint;

        if (typeof endpointFunction === 'function') {
            const result = endpointFunction();
            expect(result).toBeUndefined();
        } else {
            expect(endpointFunction).toBeUndefined();
        }
    });

    it('should catch errors during client initialization', () => {
        const errorMessage = 'Initialization failed';
        jest.spyOn(DynamoDbClientService.prototype, 'createDynamoDBClients')
        .mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });

        expect(() => new DynamoDbClientService()).toThrow(
            `Failed to initialize DynamoDB clients due to an error: ${errorMessage}`
        );
    });
});
