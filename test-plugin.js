

export {
  onBeforeInitialize,
  onInitialize,
  onAfterInitialize,

  onBeforeUpdate,
  onUpdate,
  onAfterUpdate,

  onBeforeGet,
  onGet,
  onAfterGet,
}

async function onBeforeInitialize(config, runApi) {
  console.log('onBeforeInitialize');
  await runApi("core/get", "123");
}

async function onInitialize(config, runApi) {
  console.log('onInitialize');
}

async function onAfterInitialize(config, runApi) {
  console.log("onAfterInitialize");
}

async function onBeforeUpdate(config, runApi, id, data) {
  console.log("onBeforeUpdate");
}

async function onUpdate(config, runApi, id, data) {
  console.log("onUpdate");
}

async function onAfterUpdate(config, runApi, id, data) {
  console.log("onAfterUpdate");
}

async function onBeforeGet(config, runApi, id) {
  console.log("onBeforeGet");
}

async function onGet(config, runApi, id) {
  console.log("onGet");
}

async function onAfterGet(config, runApi, id) {
  console.log("onAfterGet");
}
