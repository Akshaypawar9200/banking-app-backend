const convict = require("convict");
const convictFormatWithValidator = require("convict-format-with-validator");

// Add the "email", "ipaddress" or "url" format
convict.addFormats(convictFormatWithValidator);

module.exports = convict({
  thisNode: {
    hostName: {
      doc: "Contact App.",
      format: "ipaddress",
      default: "127.0.0.1",
      env: "HOST_NAME",
    },
    port: {
      doc: "Contact App worker port. This is the port that external services will talk to the API.",
      format: "port",
      default: "20200",
      env: "PORT",
    },
    name: {
      doc: "Contact App server name",
      format: String,
      default: "Contact App ",
      env: "WEB_API_NAME",
    },
    version: {
      doc: "Contact App version",
      format: String,
      default: "1.0.0",
      env: "WEB_API_VERSION",
    },
  },
  environment: {
    doc: "environment",
    format: ["local", "development", "beta", "production"],
    default: "local",
    env: "NODE_ENV",
  },
  error: {
    doc: "Error level enumeration.",
    format: Object,
    default: {
      IGNORE: 0,
      NORMAL: 1,
      CRITICAL: 2,
    },
  },
  supressLogstash: {
    doc: "suppress connecting to log-stash server",
    format: Boolean,
    default: true,
    env: "SUPPRESS_LOG_STASH",
  },
  logger: {
    ip: {
      doc: "Logger IP address.",
      format: "ipaddress",
      default: "127.0.0.1",
      env: "LOGGER_IP_ADDRESS",
    },
    port: {
      doc: "Logger port.",
      format: "port",
      default: 24224,
      env: "LOGGER_PORT",
    },
    level: {
      doc: "Logger level.",
      format: [
        "error",
        "warn",
        "info",
        "http",
        "verbose",
        "debug",
        "silly"
      ],
      default: "debug",
      env: "LOGGER_LEVEL",
    },
    tag: {
      contactAppApi: {
        doc: "fluent label for contactAppApi.",
        format: String,
        default: "contactAppApi",
        env: "LOGGER_TAG_CONTACT_APP_API",
      },
      node: {
        doc: "fluent tag for node components.",
        format: String,
        default: "node",
        env: "LOGGER_TAG_NODE",
      },
    },
  },
});
