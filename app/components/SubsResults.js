import React from 'react'

import {autobind} from '../utils'

import Icon from './Icon'

class SubLine extends React.Component {
  @autobind
  handleDownload() {
    this.props.onDownload(this.props.sub.id);
  }

  render() {
    const {sub} = this.props;

    return (
      <li className='result'>
        <div className='result__info'>
          <h3 className='sub-title'>{sub.filename}</h3>
          <p className='sub-meta'>{sub.downloadsCount} downloads</p>
        </div>
        <div className='result__actions'>
          {
            sub.downloaded
            ? <span>Done</span>
            : sub.downloading
              ? <span>...</span>
              : <a onClick={this.handleDownload}>
                  <Icon
                    icon='download'
                    className='download-icon'
                  />
                </a>
          }
        </div>
      </li>
    )
  }
}

export default ({subs, onDownload, notFound}) => (
  <div className='results'>
    <ul className='results'>
      {
       subs.map(sub => <SubLine key={sub.id} sub={sub} onDownload={onDownload} />)
      }
    </ul>
  </div>
)
