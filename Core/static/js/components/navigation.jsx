import React, {Component} from "react";
import {
  Container,
  Menu,
} from 'semantic-ui-react'

export default class navigation extends Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        return (
            <Menu inverted>
                <Container>
                    <Menu.Item as='a' header>
                        Optimal Location Finder
                    </Menu.Item>
                </Container>
            </Menu>
        )
    }
}