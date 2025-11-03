import { index, layout, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [index("routes/landing.tsx")]),
] satisfies RouteConfig;
