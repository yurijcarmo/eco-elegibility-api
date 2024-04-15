
import { ClientDataModel } from '../models';
import { DynamoDbClientService } from '../services';
import { 
    Injectable, 
    Inject, 
    forwardRef
} from '@nestjs/common';
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand 
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class ClientDataRepository {
    private dynamoDb: DynamoDBDocumentClient;

    constructor(
        @Inject(forwardRef(() => DynamoDbClientService))
        private readonly dynamoDbClientService: DynamoDbClientService
    ) {
        this.dynamoDb = this.dynamoDbClientService.getDocumentClient();
    }

    async putClientData(clientData: ClientDataModel): Promise<ClientDataModel> {

        const item = JSON.parse(JSON.stringify(clientData))
        
        const command = new PutCommand({
            TableName: process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY,
            Item: item
        });
        
        try {
            await this.dynamoDb.send(command);
            
            return clientData;

        } catch (error) {
            console.error(`Error sending data to DynamoDB: ${error}`);
            throw new Error(`Failed to update client data: ${error.message}`);
        }        
    }

    async getClientData(documentNumber: string): Promise<ClientDataModel> {
        const command = new GetCommand({
            TableName: process.env.DYNAMO_DB_TABLE_CLIENT_ELIGIBILITY,
            Key: { documentNumber }
        });

        try {
            const result = await this.dynamoDb.send(command);
            if (result?.Item) {
                return result.Item as unknown as ClientDataModel;
            }
            return null;
            
        } catch (error) {
            throw new Error(
                `Failed to retrieve client data: ${error.message}`
            );
        }
    }
}
