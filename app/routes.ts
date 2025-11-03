import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/landing.tsx"),
    route("specs", "routes/specs.tsx"),
    route("spendings", "routes/spendings.tsx"),
  ]),
] satisfies RouteConfig;
