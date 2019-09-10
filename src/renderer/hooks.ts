import { useEffect, useState, useReducer } from "react";
import { basename, extname } from "path";
import { Sub } from "./SubResults";
import { File } from "./Content";

export const useOnline = (initialValue: boolean) => {
  const [state, setState] = useState(initialValue);

  const checkConnection = () => setState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  return state;
};

export const useKeyup = (char: string, callback: () => void) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.target !== e.currentTarget) return;

      const pressedChar = String.fromCharCode(e.which).toLowerCase();

      if (pressedChar === char) callback();
    };
    const body = document.getElementsByTagName("body")[0];
    body.addEventListener("keyup", listener);

    return () => {
      body.removeEventListener("keyup", listener);
    };
  }, []);
};

type VideoFilesState = File[];
type VideoFilesAction =
  | { type: "request"; path: string }
  | { type: "received"; path: string; subtitles: Sub[] }
  | { type: "download"; path: string; subId: string }
  | { type: "downloaded"; path: string; subId: string }
  | { type: "reset" };

const videoFilesReducer = (
  state: VideoFilesState,
  action: VideoFilesAction
): VideoFilesState => {
  switch (action.type) {
    case "request":
      const { path } = action;

      return [
        ...state,
        {
          path,
          name: basename(path, extname(path)),
          subtitles: [],
          requesting: true,
          requestFinishedAt: undefined
        }
      ];

    case "received":
      return [
        ...state.map(file => {
          if (file.path !== action.path) return file;
          return {
            ...file,
            subtitles: action.subtitles,
            requesting: false,
            requestFinishedAt: new Date()
          };
        })
      ];

    case "download":
      return [
        ...state.map(file => {
          if (file.path !== action.path) return file;
          return {
            ...file,
            subtitles: file.subtitles.map(sub => {
              if (sub.id !== action.subId) return sub;

              return { ...sub, downloading: true, downloaded: false };
            })
          };
        })
      ];

    case "downloaded":
      return [
        ...state.map(file => {
          if (file.path !== action.path) return file;
          return {
            ...file,
            subtitles: file.subtitles.map(sub => {
              if (sub.id !== action.subId) return sub;

              return { ...sub, downloading: false, downloaded: true };
            })
          };
        })
      ];

    case "reset":
      return [];

    default:
      throw new Error(`Unknown action type`);
  }
};

export const useVideoFilesReducer = () => useReducer(videoFilesReducer, []);
