import React from 'react'
import {connect} from 'react-redux'

import {
  requestSubtitles,
  apiLogin,
  apiLogout,
  downloadSubtitle,
  setLang,
  reset,
  setOnline,
  setOffline
} from '../actions'

import {autobind} from '../utils'

import Content from './Content'
import Footer from './Footer'

class SabuApp extends React.Component {
  componentDidMount() {
    window.addEventListener('online', this.checkConnection)
    window.addEventListener('offline', this.checkConnection)
    this.checkConnection()

    this.props.apiLogin()
  }

  componentWillUmount() {
    this.props.apiLogout()

    window.removeEventListener('online', this.checkConnection)
    window.removeEventListener('offline', this.checkConnection)
  }

  @autobind
  checkConnection() {
    navigator.onLine ? this.props.setOnline() : this.props.setOffline()
  }

  @autobind
  handleDownload(subId) {
    this.props.downloadSubtitle(this.props.selectedFiles[0].path, subId)
  }

  @autobind
  handleLangChange(e) {
    this.props.setLang(e.target.value)
  }

  @autobind
  handleReset() {
    this.props.reset()
  }

  render() {
    const selectedFile = this.props.selectedFiles[0];

    return (
      <div className='sabuapp'>
        { this.props.online
          ? <Content
              selectedFiles={this.props.selectedFiles}
              onDownload={this.handleDownload}
              requestSubtitles={this.props.requestSubtitles}
              downloadSubtitle={this.props.downloadSubtitle}
            />
          : <div className='centered-screen'>
              No internet connection
            </div>

        }
        <Footer
          selectedFiles={this.props.selectedFiles}
          lang={this.props.lang}
          onLangChange={this.handleLangChange}
          onReset={this.handleReset}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
  {
    requestSubtitles,
    apiLogin,
    apiLogout,
    downloadSubtitle,
    setLang,
    reset,
    setOnline,
    setOffline
  }
)(SabuApp);
