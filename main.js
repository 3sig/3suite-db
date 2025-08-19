import config from "3lib-config";

config.init();

let db = {};
let plugins = {
  "core": {
    "plugin": {
      update: (config, runApi, ...args) => update(...args),
      get: (config, runApi, ...args) => get(...args),
    },
    config: {},
  }
};

async function initialize() {
  if (config.get("verbose")) console.log("[core] Initializing database...");

  await _loadPlugins();

  if (config.get("verbose")) console.log("[core] Running initialization plugins...");
  await _runPlugins("onBeforeInitialize", db);
  await _runPlugins("onInitialize", db);
  await _runPlugins("onAfterInitialize", db);

  if (config.get("verbose")) console.log("[core] Database initialization complete");
}

// for update, we give plugins the opportunity to modify the entry specifically
// inside of onBeforeUpdate
async function update(id, data) {
  if (config.get("verbose")) console.log(`[core] Updating entry: ${id}`);

  let updatedValue = await _runPlugins("onBeforeUpdate", id, data);

  if (updatedValue) {
    if (config.get("verbose")) console.log(`[core] Plugin modified entry: ${id}`);
    db[id] = updatedValue;
  }

  db[id] = data;

  await _runPlugins("onUpdate", id, data);
  await _runPlugins("onAfterUpdate", id, data);

  if (config.get("verbose")) console.log(`[core] Entry updated: ${id}`, data);
}

// for get, we allow plugins to modify the entry in turn
async function get(id) {
  if (config.get("verbose")) console.log(`[core] Getting entry: ${id}`);

  let entry = db[id];

  if (config.get("verbose")) console.log(`[core] Running get entry plugins for: ${id}`);
  entry = await _runPlugins("onBeforeGet", id, entry);
  entry = await _runPlugins("onGet", id, entry);
  entry = await _runPlugins("onAfterGet", id, entry);

  if (config.get("verbose")) console.log(`[core] Entry retrieved: ${id}`, entry);
  return entry;
}

async function runApi(api, ...args) {
  if (config.get("verbose")) console.log(`[core] Running API: ${api}`);

  let [target, command] = api.split("/");

  let plugin = plugins[target];
  if (config.get("verbose")) console.log(`[core] Executing plugin command: ${target}/${command}`);

  const result = await plugin.plugin[command](plugin.config, runApi, ...args);

  if (config.get("verbose")) console.log(`[core] API call completed: ${api}`);
  return result;
}

async function _runPlugins(pluginFunctionType, ...args) {
  if (config.get("verbose")) console.log(`[core] Running plugins for: ${pluginFunctionType}`);

  for (const plugin of Object.values(plugins)) {
    let pluginFunction = plugin.plugin[pluginFunctionType];
    if (pluginFunction) {
      if (config.get("verbose")) console.log(`[core] Executing plugin function: ${pluginFunctionType}`);
      await pluginFunction(plugin.config, runApi, ...args);
    }
  }

  if (config.get("verbose")) console.log(`[core] Completed plugins for: ${pluginFunctionType}`);
}

async function _loadPlugins() {
  if (config.get("verbose")) console.log("[core] Loading plugins...");

  const configPlugins = config.get("plugins");
  for (const configPlugin of configPlugins) {
    if (config.get("verbose")) console.log(`[core] Loading plugin: ${configPlugin.name} from ${configPlugin.path}`);

    const plugin = await import("./" + configPlugin.path);
    plugins[configPlugin.name] = { plugin, config: configPlugin.config };

    if (config.get("verbose")) console.log(`[core] Plugin loaded: ${configPlugin.name}`);
  }

  if (config.get("verbose")) console.log("[core] All plugins loaded");
}

initialize();
