import { DynamoDbClientService } from './DynamoDbClientService';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { 
    Injectable, 
    OnModuleInit 
} from '@nestjs/common';
import {
    AttributeDefinition,
    CreateTableCommand,
    KeySchemaElement,
    ListTablesCommand,
    ScalarAttributeType
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class SetupService implements OnModuleInit {
    private dynamoDbClient: DynamoDBDocumentClient;

    constructor(private readonly dynamoDbClientService: DynamoDbClientService) {
        this.dynamoDbClient = this.dynamoDbClientService.getDocumentClient();
    }

    async onModuleInit() {
        console.log(
            "SetupService: Checking if table exists and creating if it does not..."
        );
        await this.createTablesIfNeeded();
    }

    private async createTablesIfNeeded() {
        const exists = await this.checkTableExists();
        if (exists) {
            console.log('Table exists');
            return;
        }
        console.log('Table does not exist, creating...');
        await this.createTable();
    }

    private async checkTableExists(): Promise<boolean> {
        const command = new ListTablesCommand({});
        try {
            console.log(process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY)
            const data = await this.dynamoDbClient.send(command);
            return data.TableNames.includes(
                process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY
            );
        } catch (error) {
            console.error('Failed to list tables:', error);
            throw error;
        }
    }

    private async createTable() {
        const params = {
            TableName: process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY,
            KeySchema: [{
                AttributeName: "documentNumber",
                KeyType: "HASH"
            } as KeySchemaElement],
            AttributeDefinitions: [{
                AttributeName: "documentNumber",
                AttributeType: ScalarAttributeType.S
            } as AttributeDefinition],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        };

        const command = new CreateTableCommand(params);
        try {
            const result = await this.dynamoDbClient.send(command);
            console.log('Table created:', result.TableDescription?.TableName);
        } catch (error) {
            console.error('Failed to create table:', error);
            throw error;
        }
    }
}
