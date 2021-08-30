import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './index.less'

class App extends Component {

  render() {
    return (<div>App</div>)
  }
}

ReactDom.render(<App/>, document.getElementById('app'))