import React, {Component, Fragment} from 'react'
import {
    Container,
    Dropdown,
    Header,
    Image,
    Menu,
} from 'semantic-ui-react'
import Footer from './../components/footer'
import Navigation from './../components/navigation'
import Filters from "../components/Filters";


export default class indexContainer extends Component {
    constructor() {
        super();

        this.state = {
            step: null,
        }
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Container text style={{marginTop: '7em'}}>
                    <Header as='h1'>Welcome</Header>
                    <p>Optimal location finder (OLF) is a tool to help you find the best place to live depending on a
                        set of unique
                        requirements.</p>

                    <Filters/>
                    <br/>
                </Container>

                <Footer/>
            </div>
        )
    }
}