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

    document.getElementsByTagName('body')[0].addEventListener('keyup', this.onKeyup)

    this.props.apiLogin()
  }

  componentWillUmount() {
    this.props.apiLogout()

    document.getElementsByTagName('body')[0].removeEventListener('keyup', this.onKeyup)

    window.removeEventListener('online', this.checkConnection)
    window.removeEventListener('offline', this.checkConnection)
  }

  @autobind
  onKeyup(e) {
    if (e.target !== e.currentTarget) { return }

    const charCode = (typeof e.which === 'number') ? e.which : e.keyCode
    const char = String.fromCharCode(e.which).toLowerCase()

    if (char === 'n') {
      this.props.reset()
    }
  }

  @autobind
  checkConnection() {
    navigator.onLine ? this.props.setOnline() : this.props.setOffline()
  }

  @autobind
  handleDownload(filepath, subId) {
    this.props.downloadSubtitle(filepath, subId)
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
    return (
      <div className='sabuapp'>
        { this.props.online
          ? <Content
              videoFiles={this.props.videoFiles}
              onDownload={this.handleDownload}
              requestSubtitles={this.props.requestSubtitles}
              downloadSubtitle={this.props.downloadSubtitle}
            />
          : <div className='centered-screen'>
              No internet connection
            </div>

        }
        <Footer
          videoFiles={this.props.videoFiles}
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
