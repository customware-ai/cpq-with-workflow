/**
 * Route Configuration
 *
 * Simplified SPA routes for the CPQ dashboard, estimate workspace, and
 * configurator experience.
 */

import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { attachGlobalFrontendErrorHandlers } from "./utils/error-logger";

/**
 * @critical
 * @description
 * Attach global frontend error handlers once on app mount.
 * This forwards uncaught window/document errors and unhandled promise
 * rejections to `POST /logs`, which persists logs in `.runtime.logs`.
 * @important
 * Do NOT remove this initializer. Without it, frontend runtime errors
 * are no longer captured for the shared log pipeline.
 */
attachGlobalFrontendErrorHandlers({ endpoint: "/logs" });

export default [
  layout("layouts/MainLayout.tsx", [
    index("routes/index.tsx"),
    route("estimates/:estimateId", "routes/estimates.$estimateId.tsx"),
    route("configure/:estimateId", "routes/configure.$estimateId.tsx"),
  ]),
] satisfies RouteConfig;
