import React from "react";
import classNames from "classnames";
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
  onDownload,
  index
}: {
  sub: Sub;
  onDownload: (subId: string) => void;
  index: number;
}) => {
  const handleDownload = () => {
    onDownload(sub.id);
  };

  return (
    <li
      className={classNames("px-3 py-1 flex justify-between items-center", {
        "bg-gray-100": index % 2 === 0
      })}
    >
      <div className="flex-grow min-w-0">
        <h3 className="text-gray-700 truncate" title={sub.filename}>
          {sub.filename}
        </h3>
        <p className="text-gray-500 text-sm truncate">
          {sub.downloadsCount} downloads
        </p>
      </div>
      <div className="flex-shrink-0 h-10 w-10 ml-2">
        {sub.downloaded ? (
          <Icon icon="done" />
        ) : sub.downloading ? (
          <Icon icon="hourglass" />
        ) : (
          <button onClick={handleDownload} className="h-10 w-10">
            <Icon icon="download" />
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
  <ul className="mb-x rounded border-2 border-gray-300">
    {subs.map((sub, index) => (
      <SubLine key={sub.id} sub={sub} onDownload={onDownload} index={index} />
    ))}
  </ul>
);
