const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  defaultConfig.maxWorkers = 2; // avoids using availableParallelism
  return defaultConfig;
})();