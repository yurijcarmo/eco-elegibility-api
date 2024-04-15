import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDbClientService implements OnModuleInit {
    private static baseClient: DynamoDBClient;
    private static documentClient: DynamoDBDocumentClient;

    constructor() {
        this.initializeClient();
    }

    private initializeClient(): void {
        try {
            const clientConfig = this.createDynamoDBClientConfig();
            this.createDynamoDBClients(clientConfig);
        } catch (error) {
            console.error('Error initializing DynamoDB client: ', error);
            throw new Error(
                'Failed to initialize DynamoDB clients due to an error: ' 
                + error.message
            );
        }
    }

    createDynamoDBClientConfig(): DynamoDBClientConfig {
        const isProduction = process.env.ENVIRONMENT === 'prod.server' 
        || process.env.ENVIRONMENT === 'prod.serverless';
        return {
            region: process.env.DYNAMO_DB_REGION || 'local',
            endpoint: isProduction 
            ? undefined 
            : process.env.DYNAMO_DB_ENDPOINT_LOCAL || 'http://dynamodb-local:8000',
            credentials: {
                accessKeyId: process.env.DYNAMO_DB_ACCESS_KEY_ID!,
                secretAccessKey: process.env.DYNAMO_DB_SECRET_ACCESS_KEY!
            }
        };
    }

    createDynamoDBClients(config: DynamoDBClientConfig): void {
        DynamoDbClientService.baseClient = new DynamoDBClient(config);
        DynamoDbClientService.documentClient = DynamoDBDocumentClient.from(
            DynamoDbClientService.baseClient
        );
    }

    onModuleInit(): void {
        if (!DynamoDbClientService.baseClient || !DynamoDbClientService.documentClient) {
            console.error("Failed to initialize DynamoDB clients.");
            throw new Error("DynamoDB clients are not initialized.");
        }
    }

    getBaseClient(): DynamoDBClient {
        return DynamoDbClientService.baseClient;
    }

    getDocumentClient(): DynamoDBDocumentClient {
        return DynamoDbClientService.documentClient;
    }
}
