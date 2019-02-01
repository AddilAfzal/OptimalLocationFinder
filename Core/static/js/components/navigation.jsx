import React, {Component, Fragment} from "react";
import {
  Container,
  Dropdown,
  Image,
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
                        <Image size='mini' src='' style={{marginRight: '1.5em'}}/>
                        Optimal Location Finder
                    </Menu.Item>
                    <Menu.Item as='a'>Home</Menu.Item>
                    <Menu.Item as='a'>Explore data</Menu.Item>

                    {/*<Dropdown item simple text='Dropdown'>*/}
                        {/*<Dropdown.Menu>*/}
                            {/*<Dropdown.Item>List Item</Dropdown.Item>*/}
                            {/*<Dropdown.Item>List Item</Dropdown.Item>*/}
                            {/*<Dropdown.Divider/>*/}
                            {/*<Dropdown.Header>Header Item</Dropdown.Header>*/}
                            {/*<Dropdown.Item>*/}
                                {/*<i className='dropdown icon'/>*/}
                                {/*<span className='text'>Submenu</span>*/}
                                {/*<Dropdown.Menu>*/}
                                    {/*<Dropdown.Item>List Item</Dropdown.Item>*/}
                                    {/*<Dropdown.Item>List Item</Dropdown.Item>*/}
                                {/*</Dropdown.Menu>*/}
                            {/*</Dropdown.Item>*/}
                            {/*<Dropdown.Item>List Item</Dropdown.Item>*/}
                        {/*</Dropdown.Menu>*/}
                    {/*</Dropdown>*/}
                </Container>
            </Menu>
        )
    }
}