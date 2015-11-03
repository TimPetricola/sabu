import React from 'react'

import Icon from './Icon'
import Dropzone from './Dropzone'
import SubsResults from './SubsResults'

const FILE_FILTERS = [
  { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'm4v']}
]

const DropArea = ({onDrop}) => (
  <Dropzone
    className='dropzone'
    activeClassName='dropzone--active'
    onDrop={onDrop}
    filters={FILE_FILTERS}
  >
    <Icon icon='upload' />
    <p>Select video file</p>
    <p>Or drag and drop it</p>
  </Dropzone>
)

const FileSearch = ({file, onDownload}) => (
  <div>
    <h2>{file.name}</h2>
    { file.requesting
      ? <div>Searching...</div>
      : file.subtitles.length
        ? <SubsResults subs={file.subtitles} onDownload={(subId) => onDownload(file.path, subId) } />
        : <div>Not found</div>
    }
  </div>
)

export default class Content extends React.Component {
  render() {
    const {videoFiles, onDownload: handleDownload, requestSubtitles: handleDrop} = this.props

    return (
      <div className='main'>
        { videoFiles.length
          ? <div className='inner'>
              {videoFiles.map(file => <FileSearch file={file} onDownload={handleDownload} key={file.path} />)}
            </div>
          : <DropArea onDrop={handleDrop} />
        }
      </div>
    )
  }
}
