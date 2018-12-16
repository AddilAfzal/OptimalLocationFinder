import React from 'react'
import ReactDOM from 'react-dom'
import MapContainer from './containers/mapContainer'


function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <MapContainer name={"page_container"}/>;
ReactDOM.render(
  element,
  document.getElementById('react')
);