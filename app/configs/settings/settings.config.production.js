const convict = require("convict");
const convictFormatWithValidator = require("convict-format-with-validator");

// Add the "email", "ipaddress" or "url" format
convict.addFormats(convictFormatWithValidator);

module.exports = convict({
  auth0ClientId: {
    doc: "Auth0 Client Id",
    format: String,
    default: null,
    env: "AUTH0_CLIENT_ID",
  },
  auth0ClientSecret: {
    doc: "Auth0 Client Secret",
    format: String,
    default: null,
    env: "AUTH0_CLIENT_SECRET",
  },
  auth0Domain: {
    doc: "Auth0 Domain",
    format: String,
    default: "innovation.auth0.com",
    env: "AUTH0_DOMAIN",
  },
  auth0Realm: {
    doc: "Auth0 Realm",
    format: String,
    default: "market-place-tam-sam-dev",
    env: "AUTH0_REALM",
  },
  gcloudBaseFileName: {
    doc: "Gcloud Base File Name",
    format: String,
    default: "market-sizing",
    env: "GCLOUD_BASE_FILE_NAME",
  },
  // gcloudStorageEmail: {
  //   doc: "Gcloud Storage Email",
  //   format: "email",
  //   default: null,
  //   env: "GCLOUD_STORAGE_EMAIL",
  // },
  gcloudStorageProcessFileBucket: {
    doc: "Gcloud Storage Process File Bucket",
    format: String,
    default: "da-local-files",
    env: "GCLOUD_STORAGE_PROCESS_FILE_BUCKET",
  },
  projectId: {
    doc: "Project Id",
    format: String,
    default: null,
    env: "PROJECT_ID",
  },
  smtpFormEmail: {
    doc: "Smtp Form Email",
    format: "email",
    default: null,
    env: "SMTP_FORM_EMAIL",
  },
  smtpHost: {
    doc: "Smtp Host",
    format: String,
    default: "smtp-mail.outlook.com",
    env: "SMTP_HOST",
  },
  smtpPort: {
    doc: "Smtp Port",
    format: String,
    default: null,
    env: "SMTP_PORT",
  },
  smtpUser: {
    doc: "Smtp User",
    format: String,
    default: null,
    env: "SMTP_USER",
  },
  smtpPassword: {
    doc: "Smtp Password",
    format: String,
    default: null,
    env: "SMTP_PASSWORD",
  },
  powerBi: {
    authenticationMode: {
      doc: "Authentication Mode",
      format: String,
      default: null,
      env: "POWER_BI_AUTHENTICATION_MODE",
    },
    authorityUrl: {
      doc: "Authority Url",
      format: String,
      default: "https://login.microsoftonline.com/",
      env: "POWER_BI_AUTHORITY_URL",
    },
    scopeBase: {
      doc: "Scope Base",
      format: String,
      default: "https://analysis.windows.net/powerbi/api/.default",
      env: "POWER_BI_SCOPE_BASE",
    },
    powerBiApiUrl: {
      doc: "Power Bi Api Url",
      format: String,
      default: "https://api.powerbi.com/",
      env: "POWER_BI_API_URL",
    },
    clientId: {
      doc: "Client Id",
      format: String,
      default: null,
      env: "POWER_BI_CLIENT_ID",
    },
    clientSecret: {
      doc: "Client Secret",
      format: String,
      default: null,
      env: "POWER_BI_CLIENT_SECRET",
    },
    workspaceId: {
      doc: "Workspace Id",
      format: String,
      default: null,
      env: "POWER_BI_WORKSPACE_ID",
    },
    tenantId: {
      doc: "Tenant Id",
      format: String,
      default: null,
      env: "POWER_BI_TENANT_ID",
    },
  },
});
