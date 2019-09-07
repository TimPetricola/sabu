import React, { ChangeEvent } from "react";

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
    <footer className="app-footer">
      <select
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
        className="btn reset-btn"
        onClick={handleReset}
        disabled={!videoFiles.length}
      >
        New search
      </button>
    </footer>
  );
};
