import React, { ChangeEvent } from "react";
import classNames from "classnames";

import languages from "./languages.json";
import { File } from "./Content.js";

type Props = {
  onLangChange: (lang: string) => void;
  onReset: Function;
  lang: string;
  videoFiles: File[];
};

export default ({ onLangChange, onReset, lang, videoFiles }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onLangChange(e.target.value);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <footer className="flex-shrink-0 p-2 bg-gray-100 flex justify-between">
      <select
        className="border-2 border-blue-500 hover:border-blue-700 bg-white"
        onChange={handleChange}
        value={lang}
        disabled={videoFiles.length > 0}
      >
        {languages.map(lang => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <button
        className={classNames("text-white font-bold py-1 px-3 rounded", {
          "bg-blue-500 hover:bg-blue-700": videoFiles.length > 0,
          "bg-blue-200": videoFiles.length === 0
        })}
        onClick={handleReset}
        disabled={!videoFiles.length}
      >
        New search
      </button>
    </footer>
  );
};
