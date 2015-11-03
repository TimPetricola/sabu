// Inspired by:
// https://github.com/paramaggarwal/react-dropzone

import React, {PropTypes} from 'react'

import {autobind} from '../utils'

const dialog = window.remote.require('dialog')

function pathsFromDragEvent(e) {
  const files = e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : []
  return [...files].map(file => file.path)
}

export default class Dropzone extends React.Component {
  static propTypes = {
    onDrop: PropTypes.func.isRequired,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    filters: PropTypes.array
  }

  static defaultProps = {
    filters: []
  }

  state = {
    isDragActive: false
  }

  componentDidMount() {
    this.enterCounter = 0
    this.setExtensions(this.props)
  }

  componentWillReceiveProps(props) {
    this.setExtensions(props)
  }

  setExtensions(props) {
    this.extensions = this.props.filters.reduce(
      (acc, filter) => acc.concat(filter.extensions),
      []
    )
  }

  @autobind
  isPathAccepted(path) {
    return this.extensions.indexOf(path.split('.').pop()) !== -1
  }

  arePathsAccepted(paths) {
    return paths.every(this.isPathAccepted)
  }

  @autobind
  onDragEnter(e) {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter

    const paths =  pathsFromDragEvent(e)

    this.setState({
      isDragActive: this.arePathsAccepted(paths)
    })
  }

  @autobind
  onDragOver(e) {
    e.preventDefault()
  }

  @autobind
  onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) { return }

    this.setState({isDragActive: false})
  }

  @autobind
  onDrop(e) {
    e.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0

    this.setState({isDragActive: false})

    const paths = pathsFromDragEvent(e)

    if (paths.length && this.arePathsAccepted(paths)) {
      this.props.onDrop(paths)
    }
  }

  @autobind
  open() {
    const params = {
      properties: ['openFile', 'multiSelections'],
      filters: this.props.filters
    }

    if (this.opened) { return }
    this.opened = true

    dialog.showOpenDialog(params, (paths) => {
      this.opened = false

      if (paths && paths.length) {
        this.props.onDrop(paths);
      }
    })

  }

  render() {
    let classNames = [];

    if (this.props.className) {
      classNames.push(this.props.className)
    }

    if (this.state.isDragActive && this.props.activeClassName) {
      classNames.push(this.props.activeClassName)
    }

    return (
      <div
        className={classNames.join(' ')}
        onClick={this.open}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.children}
      </div>
    )
  }
}
