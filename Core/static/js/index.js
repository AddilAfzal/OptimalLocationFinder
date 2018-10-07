import React from 'react'
import ReactDOM from 'react-dom'
import IndexContainer from './containers/indexContainer'


function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <IndexContainer name={"test"}/>;
ReactDOM.render(
  element,
  document.getElementById('react')
);