import { TRPCError, initTRPC } from "@trpc/server";
import {
  CreateEstimateInputSchema,
  ListEstimatesFilterSchema,
} from "../contracts/estimate.js";
import { createEstimate, listEstimates } from "../services/estimate.js";
import type { AppError } from "../types/errors.js";

const t = initTRPC.create();

/**
 * Maps typed app errors into tRPC errors for transport.
 */
function toTrpcError(error: AppError): TRPCError {
  if (error.type === "VALIDATION_ERROR") {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: error.message,
    });
  }

  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: error.message,
  });
}

/**
 * Minimal template router with one related CPQ estimate example flow.
 */
export const appRouter = t.router({
  listEstimates: t.procedure
    .input(ListEstimatesFilterSchema.optional())
    .query(async ({ input }) => {
      const result = await listEstimates(input ?? {});
      if (result.isErr()) {
        throw toTrpcError(result.error);
      }

      return result.value;
    }),

  createEstimate: t.procedure
    .input(CreateEstimateInputSchema)
    .mutation(async ({ input }) => {
      const result = await createEstimate(input);
      if (result.isErr()) {
        throw toTrpcError(result.error);
      }

      return result.value;
    }),
});

export type AppRouter = typeof appRouter;
