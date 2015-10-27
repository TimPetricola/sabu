import React from 'react'

import Icon from './Icon'
import Dropzone from './Dropzone'
import SpinnerScreen from './SpinnerScreen'
import SubsResults from './SubsResults'

import {autobind} from '../utils'

const FILE_FILTERS = [
  { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'm4v']}
]

const SubsLoading = () => (
  <SpinnerScreen>
    [Sabu] Searching for your subtitles...
  </SpinnerScreen>
)

const SubsNotFound = () => (
  <div className='centered-screen'>
    Subtitles not found
  </div>
)

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

export default class Content extends React.Component {
  @autobind
  handleDrop(paths) {
    [paths[0]].forEach(this.props.requestSubtitles)
  }

  @autobind
  handleDownload(subId) {
    this.props.downloadSubtitle(this.props.selectedFiles[0].path, subId)
  }

  render() {
    const selectedFile = this.props.selectedFiles[0]

    return (
      <div className='main'>
        { selectedFile
          ? selectedFile.requesting
            ? <SubsLoading />
            : selectedFile.subtitles.length
              ? <SubsResults subs={selectedFile.subtitles} onDownload={this.handleDownload} />
              : <SubsNotFound />
          : <DropArea onDrop={this.handleDrop} />
        }
      </div>
    )
  }
}
