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
      <li className='subtitle'>
        <div className='subtitle__info'>
          <h3 className='subtitle__title'>{sub.filename}</h3>
          <p className='subtitle__meta'>{sub.downloadsCount} downloads</p>
        </div>
        <div className='subtitle__actions'>
          { sub.downloaded
            ? <Icon icon='done' className='subtitle__cta-icon' />
            : sub.downloading
              ? <Icon icon='spinner' className='subtitle__cta-icon' />
              : <button onClick={this.handleDownload}>
                  <Icon icon='download' className='subtitle__cta-icon' />
                </button>
          }
        </div>
      </li>
    )
  }
}

export default ({subs, onDownload, notFound}) => (
  <ul className='subtitles'>
    { subs.map(sub =>
      <SubLine key={sub.id} sub={sub} onDownload={onDownload} />
    )}
  </ul>
)
