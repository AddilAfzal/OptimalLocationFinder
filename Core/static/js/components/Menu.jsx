import React, {Component, Fragment} from "react";
import {
  Container,

  Menu,
} from 'semantic-ui-react'

export default class CustomMenu extends Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        const {pagePath, changePage} = this.props;

        return (
            <Menu pointing secondary>
                <Menu.Item
                    name='Search'
                    active={pagePath === '/'}
                    onClick={() => changePage('/')}
                />
                <Menu.Item
                    name='Explore'
                    active={pagePath === '/explore/'}
                    onClick={() => changePage('/explore/')}
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='About'
                    />
                </Menu.Menu>
            </Menu>
        )
    }
}