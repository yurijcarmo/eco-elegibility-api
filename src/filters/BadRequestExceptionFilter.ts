import { Response } from 'express';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException
} from '@nestjs/common';

interface ValidationErrorResponse {
    statusCode: number;
    message: string[];
    error: string;
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const responseError = exception.getResponse() as ValidationErrorResponse;

        const reasons = this.extractErrorMessages(responseError);

        response.status(status).json({
            eligible: false,
            reasons: reasons
        });
    }

    private extractErrorMessages(responseError: ValidationErrorResponse)
        : string[] {
        return responseError.message.map(error => error);
    }
}
