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

    document.addEventListener('keyup', this.onKeyup)

    this.props.apiLogin()
  }

  componentWillUmount() {
    this.props.apiLogout()

    document.removeEventListener('keyup', this.onKeyup)

    window.removeEventListener('online', this.checkConnection)
    window.removeEventListener('offline', this.checkConnection)
  }

  @autobind
  onKeyup(e) {
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
  handleDownload(subId) {
    this.props.downloadSubtitle(this.props.selectedFiles[0].path, subId)
  }

  @autobind
  handleLangChange(e) {
    const newLang = e.target.value;

    if (newLang === this.props.lang) { return }

    this.props.setLang(newLang)

    // restart the search with new language
    if (this.props.selectedFiles.length) {
      const paths = this.props.selectedFiles.map(file => file.path)
      this.props.reset()
      paths.forEach(this.props.requestSubtitles)
    }
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
