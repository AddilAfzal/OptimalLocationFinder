import React, {Component, Fragment} from "react";
import {
    Button, Container, Header
} from 'semantic-ui-react'

export default class filters extends Component {
    constructor() {
        super();

        this.state = {
            show: false,
        };
    }

    render() {
        return (
            <div>
                <Button primary size="large" onClick={ () => this.setState({show: true}) } disabled={this.state.show}>Start</Button>
                { this.state.show &&
                    <Fragment>
                        <br/>
                        <br/>
                        <hr/>
                        <Header as='h1'>Are you looking for a home for Sale or to Rent?</Header>
                        <Button>Sale</Button> <Button>Rent</Button>
                    </Fragment>

                }

            </div>
        )
    }
}