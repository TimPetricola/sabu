import { ipcMain } from "electron";

const host = (() => {
  const callbacks: { [k: string]: Function } = {};

  const on = function(channel: string, callback: Function) {
    callbacks[channel] = callback;
  };

  ipcMain.on(
    "ipc-promised",
    (event: any, uuid: string, channel: string, options: any) => {
      new Promise((resolve, reject) => {
        callbacks[channel](resolve, reject, options);
      })
        .then(data => {
          event.sender.send("ipc-promised-resolve", uuid, data);
        })
        .catch(data => {
          event.sender.send("ipc-promised-reject", uuid, data);
        });
    }
  );

  return {
    on
  };
})();

export default host;
