import React, { useState, ReactNode } from "react";
import { remote, FileFilter, OpenDialogOptions } from "electron";

type Props = {
  onDrop: (paths: string[]) => void;
  className?: string;
  activeClassName?: string;
  filters?: FileFilter[];
  children: ReactNode;
};

export default ({
  onDrop,
  className,
  activeClassName,
  filters = [],
  children
}: Props) => {
  const [isDragActive, setDragActive] = useState(false);
  const [enterCount, setEnterCount] = useState(0); // TODO: state might not be the best way
  const [isOpen, setOpen] = useState(false);

  const extensions: string[] = filters.reduce(
    (acc: any[], filter) => acc.concat(filter.extensions),
    []
  );

  const isPathAccepted = (path: string) => {
    const extension = path.split(".").pop();
    if (extension == null) return false;

    return extensions.includes(extension);
  };

  const pathsFromDragEvent = (e: React.DragEvent<HTMLDivElement>) =>
    [...e.dataTransfer.files].map(file => file.path);

  const arePathsAccepted = (paths: string[]) => paths.every(isPathAccepted);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    setEnterCount(enterCount + 1);

    const paths = pathsFromDragEvent(e);

    setDragActive(arePathsAccepted(paths));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const newEntercount = enterCount - 1;

    // Only deactivate once the dropzone and all children was left.
    setEnterCount(newEntercount);

    if (newEntercount > 0) return;

    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setEnterCount(0);
    setDragActive(false);

    const paths = pathsFromDragEvent(e);

    if (paths.length && arePathsAccepted(paths)) onDrop(paths);
  };

  const open = () => {
    const params = {
      properties: [
        "openFile",
        "multiSelections"
      ] as OpenDialogOptions["properties"],
      filters: filters
    };

    if (isOpen) return;
    setOpen(true);

    remote.dialog.showOpenDialog(params, paths => {
      setOpen(false);

      if (paths && paths.length) onDrop(paths);
    });
  };

  let classNames = [];
  if (className) classNames.push(className);
  if (isDragActive && activeClassName) classNames.push(activeClassName);

  return (
    <div
      className={classNames.join(" ")}
      onClick={open}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};
