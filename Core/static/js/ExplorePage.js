import React from 'react'
import ReactDOM from 'react-dom'
import ExploreContainer from './containers/exploreContainer'

const element = <ExploreContainer name={"page_container"}/>;
ReactDOM.render(
  element,
  document.getElementById('react')
);