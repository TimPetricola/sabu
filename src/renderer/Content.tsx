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
    className="border-2 border-gray-300 rounded m-3 p-6 text-center flex flex-col justify-center items-center flex-grow"
    activeClassName="bg-blue-100 border-blue-300"
    onDrop={onDrop}
    filters={FILE_FILTERS}
  >
    <div className="h-32 w-32 mb-5">
      <Icon icon="upload" />
    </div>
    <p className="font-bold text-gray-700 text-lg mb-2">
      Drag & drop video files
    </p>
    <p className="text-gray-500">
      or{" "}
      <span className="cursor-pointer border-b-2 border-gray-300 hover:text-gray-600 hover:border-gray-400">
        browse
      </span>
    </p>
  </Dropzone>
);

const Result = ({
  file,
  onDownload
}: {
  file: File;
  onDownload: (path: string, subId: string) => void;
}) => (
  <div className="mb-4 mx-4">
    <h2 className="text-gray-700 mb-1 truncate" title={file.name}>
      {file.name}
    </h2>
    {file.subtitles.length ? (
      <SubResults
        subs={file.subtitles}
        onDownload={subId => onDownload(file.path, subId)}
      />
    ) : (
      <div className="mb-x py-1 px-3 rounded border-2 border-red-300 bg-red-100 flex items-center">
        <div className="h-10 w-10 mr-2">
          <Icon icon="robot" />
        </div>
        Ooops, not found.
      </div>
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
      {requesting.length ? (
        <div className="m-3 p-6 text-center flex flex-col justify-center items-center flex-grow">
          <div className="h-32 w-32 mb-5">
            <Icon icon="hourglass" />
          </div>

          <p className="font-bold text-gray-700 text-lg mb-2">Searching...</p>
        </div>
      ) : null}
    </>
  );
};

type Props = {
  videoFiles: File[];
  onDownload: (path: string, subId: string) => void;
  requestSubtitles: (paths: string[]) => void;
};

export default ({ videoFiles, requestSubtitles, onDownload }: Props) => {
  return videoFiles.length ? (
    <Results files={videoFiles} onDownload={onDownload} />
  ) : (
    <div className="flex flex-col h-full">
      <DropArea onDrop={requestSubtitles} />
    </div>
  );
};
