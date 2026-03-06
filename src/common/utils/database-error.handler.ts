import {
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { LoggerService } from '@nestjs/common';

/**
 * Handles database-specific errors and throws appropriate HTTP exceptions
 */
export function handleDatabaseError(error: unknown, operation: string): never {
  // Handle TypeORM QueryFailedError
  if (error instanceof QueryFailedError) {
    const driverError = error.driverError as
      | Record<string, unknown>
      | undefined;

    // MySQL duplicate entry
    if (driverError?.code === 'ER_DUP_ENTRY' || driverError?.errno === 1062) {
      throw new BadRequestException('A record with this data already exists');
    }

    // Foreign key constraint violation
    if (
      driverError?.code === 'ER_NO_REFERENCED_ROW_2' ||
      driverError?.errno === 1452
    ) {
      throw new BadRequestException('Referenced record does not exist');
    }

    // Data too long for column
    if (
      driverError?.code === 'ER_DATA_TOO_LONG' ||
      driverError?.errno === 1406
    ) {
      throw new BadRequestException('Data exceeds maximum allowed length');
    }

    // Connection errors
    if (
      driverError?.code === 'ECONNREFUSED' ||
      driverError?.code === 'ETIMEDOUT'
    ) {
      throw new InternalServerErrorException(
        'Service temporarily unavailable. Please try again later.',
      );
    }
  }

  // Re-throw if already an HTTP exception
  if (error instanceof HttpException) {
    throw error;
  }

  // Default to internal server error
  throw new InternalServerErrorException(
    `An error occurred while ${operation}. Please try again later.`,
  );
}

/**
 * Handles service-level errors with logging and delegates to handleDatabaseError
 * Use this in catch blocks of service methods
 */
export function handleServiceError(
  error: unknown,
  operation: string,
  logger: LoggerService,
  context: string,
): never {
  // Re-throw HTTP exceptions immediately (already handled)
  if (error instanceof HttpException) {
    throw error;
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(`Error ${operation}: ${errorMessage}`, errorStack, context);

  handleDatabaseError(error, operation);
}
