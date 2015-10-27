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

import Content from './Content'
import Footer from './Footer'

class SabuApp extends React.Component {
  componentDidMount() {
    window.addEventListener('online', this.checkConnection.bind(this))
    window.addEventListener('offline', this.checkConnection.bind(this))
    this.checkConnection()

    this.props.apiLogin()
  }

  componentWillUmount() {
    this.props.apiLogout()

    window.removeEventListener('online', this.checkConnection.bind(this))
    window.removeEventListener('offline', this.checkConnection.bind(this))
  }

  checkConnection() {
    navigator.onLine ? this.props.setOnline() : this.props.setOffline()
  }

  handleDownload(subId) {
    this.props.downloadSubtitle(this.props.selectedFiles[0].path, subId)
  }

  handleLangChange(e) {
    this.props.setLang(e.target.value)
  }

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
              onDownload={this.handleDownload.bind(this)}
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
          onLangChange={this.handleLangChange.bind(this)}
          onReset={this.handleReset.bind(this)}
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
