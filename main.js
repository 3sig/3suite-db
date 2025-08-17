import config from "3lib-config";

config.init();

let db = {};
let plugins = {
  "core": {
    "plugin": {
      updateEntry: (config, runApi, ...args) => updateEntry(...args),
      getEntry: (config, runApi, ...args) => getEntry(...args),
    },
    config: {},
  }
};

async function initialize() {
  await _loadPlugins();

  await _runPlugins("onBeforeInitialize", db);
  await _runPlugins("onInitialize", db);
  await _runPlugins("onAfterInitialize", db);
}

// for updateEntry, we give plugins the opportunity to modify the entry specifically
// inside of onBeforeUpdate
async function updateEntry(id, data) {
  let updatedValue = await _runPlugins("onBeforeUpdate", id, data);

  if (updatedValue) db[id] = updatedValue;

  db[id] = data;

  await _runPlugins("onUpdate", id, data);
  await _runPlugins("onAfterUpdate", id, data);
}

// for getEntry, we allow plugins to modify the entry in turn
async function getEntry(id) {
  let entry = db[id];

  entry = await _runPlugins("onBeforeGetEntry", id, entry);
  entry = await _runPlugins("onGetEntry", id, entry);
  entry = await _runPlugins("onAfterGetEntry", id, entry);

  return entry;
}

async function runApi(api, ...args) {
  let [target, command] = api.split("/");

  let plugin = plugins[target];
  return await plugin.plugin[command](plugin.config, runApi, ...args);
}

async function _runPlugins(pluginFunctionType, ...args) {
  for (const plugin of Object.values(plugins)) {
    let pluginFunction = plugin.plugin[pluginFunctionType];
    if (pluginFunction) {
      await pluginFunction(plugin.config, runApi, ...args);
    }
  }
}

async function _loadPlugins() {
  const configPlugins = config.get("plugins");
  for (const configPlugin of configPlugins) {
    const plugin = await import("./" + configPlugin.path);
    plugins[configPlugin.name] = { plugin, config: configPlugin.config };
  }
}

initialize();
