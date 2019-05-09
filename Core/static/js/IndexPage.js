import React from 'react'
import ReactDOM from 'react-dom'
import IndexContainer from './containers/indexContainer'


const element = <IndexContainer/>;
ReactDOM.render(
  element,
  document.getElementById('react')
);

module.hot.accept();