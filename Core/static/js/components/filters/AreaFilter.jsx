import React, {Component, Fragment} from "react";
import {
    Header, Form, Label
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";


export default class AreaFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.area = null;
    }

    static description = "Filter the list of homes to be located within a specific area.";

    handleChangeArea = (a,b) => {
        this.setState({area: b.value});
    };

    getCollapsedText = () => {
        return "Area: " + this.state.area;
    };


    renderBody() {
        const {data} = this.state;

        return (
            <Fragment>
                <h3>Area</h3>
                <Form.Group inline>
                    {/*<label>Where should the property be situated?</label>*/}
                    <Header size='small'>Where should the property be located?</Header>
                    <Form.Input
                        width={7}
                        fluid
                        placeholder='London, West Midlands EC1 V,'
                        onChange={this.handleChangeArea}
                    />

                    <Form.Input
                        width={4}
                        fluid
                        labelPosition='right'
                        placeholder='1'
                        label='Radius'>
                        <input/>
                        <Label>Miles</Label>
                    </Form.Input>
                </Form.Group>
            </Fragment>
        )
    }
}