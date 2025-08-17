

export {
  onBeforeInitialize,
  onInitialize,
  onAfterInitialize,

  onBeforeUpdateEntry,
  onUpdateEntry,
  onAfterUpdateEntry,

  onBeforeGetEntry,
  onGetEntry,
  onAfterGetEntry,
}

async function onBeforeInitialize(config, runApi) {
  console.log('onBeforeInitialize');
  await runApi("core/getEntry", "123");
}

async function onInitialize(config, runApi) {
  console.log('onInitialize');
}

async function onAfterInitialize(config, runApi) {
  console.log("onAfterInitialize");
}

async function onBeforeUpdateEntry(config, runApi, id, data) {
  console.log("onBeforeUpdateEntry");
}

async function onUpdateEntry(config, runApi, id, data) {
  console.log("onUpdateEntry");
}

async function onAfterUpdateEntry(config, runApi, id, data) {
  console.log("onAfterUpdateEntry");
}

async function onBeforeGetEntry(config, runApi, id) {
  console.log("onBeforeGetEntry");
}

async function onGetEntry(config, runApi, id) {
  console.log("onGetEntry");
}

async function onAfterGetEntry(config, runApi, id) {
  console.log("onAfterGetEntry");
}
