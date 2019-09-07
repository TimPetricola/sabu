import React from "react";
import SubResults, { Sub } from "./SubResults";
import Dropzone from "./Dropzone";
import Icon from "./Icon";

const FILE_FILTERS = [
  { name: "Movies", extensions: ["mkv", "avi", "mp4", "m4v"] }
];

export type File = {
  name: string;
  path: string;
  hash?: string;
  requesting: boolean;
  requestFinishedAt?: Date;
  subtitles: Sub[];
};

const DropArea = ({ onDrop }: { onDrop: (paths: string[]) => void }) => (
  <Dropzone
    className="dropzone"
    activeClassName="dropzone--active"
    onDrop={onDrop}
    filters={FILE_FILTERS}
  >
    <Icon icon="upload" className="upload-icon" />
    <p>Select video file</p>
    <p>Or drag and drop it</p>
  </Dropzone>
);

const Result = ({
  file,
  onDownload
}: {
  file: File;
  onDownload: (path: string, subId: string) => void;
}) => (
  <div className="result">
    <h2 className="result__title" title={file.name}>
      {file.name}
    </h2>
    {file.subtitles.length ? (
      <SubResults
        subs={file.subtitles}
        onDownload={subId => onDownload(file.path, subId)}
      />
    ) : (
      <div className="result__not-found">Not found</div>
    )}
  </div>
);

const Results = ({
  files,
  onDownload
}: {
  files: File[];
  onDownload: (path: string, subId: string) => void;
}) => {
  const done: File[] = [];
  const requesting: File[] = [];

  files.forEach(file => (file.requesting ? requesting : done).push(file));
  done.sort((a, b) => +a.requestFinishedAt! - +b.requestFinishedAt!);

  return (
    <>
      {done.map(file => (
        <Result file={file} onDownload={onDownload} key={file.path} />
      ))}
      {requesting.length ? <div className="loading">Searching...</div> : null}
    </>
  );
};

type Props = {
  videoFiles: File[];
  onDownload: (path: string, subId: string) => void;
  requestSubtitles: (paths: string[]) => void;
};

export default ({ videoFiles, requestSubtitles, onDownload }: Props) => {
  return (
    <div className="main">
      {videoFiles.length ? (
        <Results files={videoFiles} onDownload={onDownload} />
      ) : (
        <DropArea onDrop={requestSubtitles} />
      )}
    </div>
  );
};
