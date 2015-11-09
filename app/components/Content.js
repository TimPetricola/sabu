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
    <Icon icon='upload' className='upload-icon' />
    <p>Select video file</p>
    <p>Or drag and drop it</p>
  </Dropzone>
)

const Result = ({file, onDownload}) => (
  <div className='result'>
    <h2 className='result__title' title={file.name}>{file.name}</h2>
    { file.subtitles.length
      ? <SubsResults subs={file.subtitles} onDownload={(subId) => onDownload(file.path, subId) } />
      : <div clasName='result__not-found'>Not found</div>
    }
  </div>
)

class Results extends React.Component {
  render() {
    const {files, onDownload} = this.props

    const done = []
    const requesting = []

    files.forEach(file => (file.requesting ? requesting : done).push(file))
    done.sort((a, b) => a.requestFinishedAt - b.requestFinishedAt)

    return (
      <div className='results'>
        { done.map(file =>
          <Result file={file} onDownload={onDownload} key={file.path} />
        )}
        { requesting.length
          ? <div className='loading'>Searching...</div>
          : null
        }
      </div>
    )
  }
}

export default class Content extends React.Component {
  render() {
    const {videoFiles, onDownload: handleDownload, requestSubtitles: handleDrop} = this.props

    return (
      <div className='main'>
        { videoFiles.length
          ? <Results files={videoFiles} onDownload={handleDownload} />
          : <DropArea onDrop={handleDrop} />
        }
      </div>
    )
  }
}
