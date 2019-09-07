import React, { useEffect, useState } from "react";
import { basename, dirname } from "path";

import Footer from "./Footer";
import api from "./api";
import Content from "./Content";
import ipc from "./ipc";
import { sanitizeSubtitles } from "./utils";
import { useOnline, useKeyup, useVideoFilesReducer } from "./hooks";

export default () => {
  const isOnline = useOnline(true);
  const [lang, setLang] = useState("eng");
  const [videoFiles, dispatchVideoFiles] = useVideoFilesReducer();

  useKeyup("n", () => dispatchVideoFiles({ type: "reset" }));

  useEffect(() => {
    api.login();

    return () => {
      api.logout();
    };
  }, []);

  const searchSubtitlesByName = (path: string) => {
    const filename = basename(path);

    api.searchQuery(lang, filename).then(subtitles => {
      const sanitized = sanitizeSubtitles(subtitles, path);
      dispatchVideoFiles({
        type: "received",
        path,
        subtitles: sanitized
      });
    });
  };

  const searchSubtitles = (
    path: string,
    { hash, size }: { hash: string; size: number }
  ) => {
    api.searchHash(lang, hash, size).then((subtitles: any[]) => {
      const sanitized = sanitizeSubtitles(subtitles, path);
      if (sanitized.length > 0) {
        dispatchVideoFiles({
          type: "received",
          path,
          subtitles: sanitized
        });
      } else {
        searchSubtitlesByName(path);
      }
    });
  };

  const handleRequestSubtitles = (paths: string[]) => {
    paths.forEach(path => dispatchVideoFiles({ type: "request", path }));

    paths.forEach(path => {
      ipc
        .send("file-hash", path)
        .then((data: { hash: string; size: number }) => {
          searchSubtitles(path, data);
        })
        .catch(() => {
          // Couldn't compute hash, search by name
          searchSubtitlesByName(path);
        });
    });
  };

  const handleDownload = (path: string, subId: string) => {
    dispatchVideoFiles({
      type: "download",
      path,
      subId
    });

    const file = videoFiles.find(f => f.path === path);
    if (file == null) throw new Error("File could not be found");

    const sub = file.subtitles.find(s => s.id === subId);
    if (sub == null) throw new Error("Sub could not be found");

    const dir = dirname(path);
    const subPath = `${dir}/${file.name}.${sub.langIso639}.srt`;

    ipc
      .send("sub-download", { downloadLink: sub.downloadLink, subPath })
      .then(() => {
        dispatchVideoFiles({
          type: "downloaded",
          path,
          subId
        });
      });
  };

  const handleReset = () => {
    dispatchVideoFiles({ type: "reset" });
  };

  return (
    <div className="sabuapp">
      {isOnline ? (
        <Content
          videoFiles={videoFiles}
          onDownload={handleDownload}
          requestSubtitles={handleRequestSubtitles}
        />
      ) : (
        <div className="centered-screen">No internet connection</div>
      )}
      <Footer
        videoFiles={videoFiles}
        lang={lang}
        onLangChange={setLang}
        onReset={handleReset}
      />
    </div>
  );
};
