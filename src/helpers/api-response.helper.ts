import { HttpStatus } from '@nestjs/common';

export interface ApiResponse {
    statusCode: HttpStatus;
    message: string;
    data?: any;
    success: boolean;
}

export function apiResponse(statusCode: HttpStatus, message: string, data?: any, status: boolean = false): ApiResponse {
    return { statusCode, message, data, success: status };
}