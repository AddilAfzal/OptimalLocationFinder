import React, {Component, Fragment} from "react";
import {
    Header, Form, Label
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";


export default class AreaFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.area = "London, United Kingdom";
        this.state.radius = 2; // in KM
    }

    static description = "Filter the list of homes to be located within a specific area.";

    getCollapsedText = () => {
        return (
            <Fragment>
                <h3>Area</h3>
                <p><i className="fas fa-map-marker-alt"/> {this.state.area}</p>
            </Fragment>
        )
    };

    getData = () => {
        let {area, radius} = this.state;
        return {
            'area': {
                area,
                radius
            }
        };
    };


    renderBody() {
        const {area, radius} = this.state;

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
                        onChange={(a,b) => this.setState({area: b.value})}
                        value={area}
                    />

                    <Form.Input
                        width={4}
                        fluid
                        labelPosition='right'
                        placeholder='1'
                        value={radius}
                        onChange={(a,b) => this.setState({radius: b.value})}
                        label='Radius'>
                        <input/>
                        <Label>Miles</Label>
                    </Form.Input>
                </Form.Group>
            </Fragment>
        )
    }
}