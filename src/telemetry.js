import Raven from "raven-js";

export default function registerTelemetry() {
  Raven.config("https://f571beaf5cee4e3085e0bf436f3eb158@sentry.io/256771").install();
}
