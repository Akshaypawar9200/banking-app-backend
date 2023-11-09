const os = require('os');

function loadEnvironmentConfigFile(settings) {
  let config;

  if (!settings.environment)
    throw new Error("Error: The required environment value is empty or not provided. Please set a valid value for the environment variable");

  const configLocation = `./settings.config.${settings.environment}.js`;

  try {
    config = require(configLocation);
  } catch (e) {
    throw new Error(
      `Unable to parse "app/configs/settings/"${configLocation}: ${e}`
    );
  }

  return config;
}

function loadConfigSettings(_settings) {
  let settings = _settings;

  const config = loadEnvironmentConfigFile(settings);

  config.validate({ allowed: 'strict' });

  settings = { ...settings, ...config.get() };
  return settings;
}

function loadServerSettings(_settings) {
  const settings = _settings;
  settings.serverName = os.hostname().toLowerCase();
  settings.serverCores = os.cpus().length;
}

function initializeSettings(settings) {
}

function SettingsConfig() {
  // This module initializes the sessionManager Web API with the required configuration.
  const mainConfig = require('./main.config');

  mainConfig.validate();
  this.settings = mainConfig.get();
  this.settings = loadConfigSettings(this.settings);
  console.log(this.settings)

  loadServerSettings(this.settings);
}

module.exports = SettingsConfig;
