import { ipcRenderer } from "electron";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const client = (() => {
  const promises: { [k: string]: { resolve: Function; reject: Function } } = {};

  const send = (channel: string, options: any) => {
    return new Promise<any>((resolve, reject) => {
      const id = uuid();
      promises[id] = { resolve, reject };
      ipcRenderer.send("ipc-promised", id, channel, options);
    });
  };

  const on = (channel: string, callback: Function) =>
    ipcRenderer.on(channel, callback);

  ipcRenderer.on(
    "ipc-promised-resolve",
    (event: any, uuid: string, data: any) => {
      promises[uuid].resolve(data);
      delete promises[uuid];
    }
  );

  ipcRenderer.on(
    "ipc-promised-reject",
    (event: any, uuid: string, data: any) => {
      promises[uuid].reject(data);
      delete promises[uuid];
    }
  );

  return {
    on,
    send
  };
})();

export default client;
