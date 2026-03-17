import { ResultAsync, errAsync } from "neverthrow";
import {
  CreateEstimateInputSchema,
  EstimateSchema,
  ListEstimatesFilterSchema,
  type Estimate,
} from "../contracts/estimate.js";
import { createEstimateRow, listEstimateRows } from "../db/queries/estimates.js";
import type { AppError, ValidationError } from "../types/errors.js";

/**
 * Converts zod issues into a typed validation error payload.
 */
function validationError(message: string, issues: string[]): ValidationError {
  return {
    type: "VALIDATION_ERROR",
    message,
    issues,
  };
}

/**
 * Validates and returns estimates for the template example service.
 */
export function listEstimates(
  input: unknown,
): ResultAsync<Estimate[], AppError> {
  const filtersResult = ListEstimatesFilterSchema.safeParse(input ?? {});
  if (!filtersResult.success) {
    return errAsync(
      validationError(
        "Invalid estimate filters",
        filtersResult.error.issues.map((issue) => issue.message),
      ),
    );
  }

  return listEstimateRows(filtersResult.data).andThen((rows) => {
    const run = ResultAsync.fromThrowable(async () => {
      return rows.map((row) => EstimateSchema.parse(row));
    }, () =>
      validationError("Failed to parse estimate rows", [
        "Database rows did not match the estimate contract.",
      ]),
    );

    return run();
  });
}

/**
 * Validates input and creates a single estimate.
 */
export function createEstimate(input: unknown): ResultAsync<Estimate, AppError> {
  const createResult = CreateEstimateInputSchema.safeParse(input);
  if (!createResult.success) {
    return errAsync(
      validationError(
        "Invalid estimate payload",
        createResult.error.issues.map((issue) => issue.message),
      ),
    );
  }

  return createEstimateRow(createResult.data).andThen((row) => {
    const run = ResultAsync.fromThrowable(async () => {
      return EstimateSchema.parse(row);
    }, () =>
      validationError("Failed to parse created estimate", [
        "Database row did not match the estimate contract.",
      ]),
    );

    return run();
  });
}
