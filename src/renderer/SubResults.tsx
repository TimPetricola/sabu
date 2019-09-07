import React from "react";
import Icon from "./Icon";

export type Sub = {
  id: string;
  filename: string;
  langIso639: string;
  downloadLink: string;
  downloadsCount: number;
  downloaded: boolean;
  downloading: boolean;
  season?: number;
  episode?: number;
};

const SubLine = ({
  sub,
  onDownload
}: {
  sub: Sub;
  onDownload: (subId: string) => void;
}) => {
  const handleDownload = () => {
    onDownload(sub.id);
  };

  return (
    <li className="subtitle">
      <div className="subtitle__info">
        <h3 className="subtitle__title">{sub.filename}</h3>
        <p className="subtitle__meta">{sub.downloadsCount} downloads</p>
      </div>
      <div className="subtitle__actions">
        {sub.downloaded ? (
          <Icon icon="done" className="subtitle__cta-icon" />
        ) : sub.downloading ? (
          <Icon icon="spinner" className="subtitle__cta-icon" />
        ) : (
          <button onClick={handleDownload}>
            <Icon icon="download" className="subtitle__cta-icon" />
          </button>
        )}
      </div>
    </li>
  );
};

type Props = {
  subs: Sub[];
  onDownload: (subId: string) => void;
};

export default ({ subs, onDownload }: Props) => (
  <ul className="subtitles">
    {subs.map(sub => (
      <SubLine key={sub.id} sub={sub} onDownload={onDownload} />
    ))}
  </ul>
);
