import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './index.less';
import pic from './logo.png';
class App extends Component {
  render() {
    return (<div>
      App
      <img src={pic}/>
    </div>)
  }
}

ReactDom.render(<App/>, document.getElementById('app'))