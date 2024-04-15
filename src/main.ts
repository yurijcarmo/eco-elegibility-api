import { AppModule } from './AppModule';
import dotenv from 'dotenv';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessHttp from 'serverless-http';
import express from 'express';
import {
    APIGatewayProxyEvent,
    Context
} from 'aws-lambda';
import {
    NestFactory,
    Reflector
} from '@nestjs/core';
import {
    BadRequestExceptionFilter,
    AllExceptionsFilter
} from './filters';
import {
    Logger,
    ValidationPipe,
    ClassSerializerInterceptor,
    INestApplication
} from '@nestjs/common';

console.log(`Initial ENVIRONMENT: ${process.env.ENVIRONMENT}`);

const envFile = process.env.ENVIRONMENT 
    ? `.env.${process.env.ENVIRONMENT}` 
    : '.env';
dotenv.config({ path: envFile });
dotenv.config({ path: envFile });

console.log(`Configured Environment: ${process.env.ENVIRONMENT}`);
console.log(`Loading configurations from: ${envFile}`);

async function configureApp(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );
    app.useGlobalFilters(
        new BadRequestExceptionFilter(), 
        new AllExceptionsFilter()
    );
}

async function createNestServer(expressInstance: express.Express)
: Promise<express.Application> {
    const app = await NestFactory.create(
        AppModule, 
        new ExpressAdapter(expressInstance)
    );
    await configureApp(app);
    await app.init();
    return expressInstance;
}

export const handler = async (
    event: APIGatewayProxyEvent, 
    context: Context
) => {
    const expressApp = express();
    await createNestServer(expressApp);
    const serverlessHandler = serverlessHttp(expressApp);
    context.callbackWaitsForEmptyEventLoop = false;
    return serverlessHandler(event, context);
};

if (process.env.IS_SERVERLESS == 'false') {
    const expressApp = express();
    createNestServer(expressApp).then(() => {
        const port = process.env.PORT || 3000;
        expressApp.listen(port, () => {
            Logger.log(`Listening on http://localhost:${port}/`);
        });
    }).catch(error => {
        Logger.error('Error during application startup:', error);
        process.exit(1);
    });
}
