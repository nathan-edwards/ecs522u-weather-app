import React from 'react'

import Iphone from './iphone'
import Ipad from './ipad'
require('dotenv').config()

export default class App extends React.Component {

  constructor(props) {
    super(props)
    const urlBar = window.location.href
    if (urlBar.includes('ipad')) {
      this.state = {
        isTablet: true
      }
    } else {
      this.state = {
        isTablet: false
      }
    }
  }

  render() {

    if (this.state.isTablet === true) {
      return (
        <Ipad />
      )
    } else {
      return (
        <Iphone />
      )
    }
  }
}


