import React, {Component, Fragment} from "react";
import {
    Header, Divider
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Range} from "rc-slider";

function bedroomsRange() {
    let values = {};

    for (let i = 1; i <= 10; i += 1) {
        values[i] = (i == 10) ? i + "+" : i;
    }

    return values;
}

export default class RoomsFilter extends BaseFilter {
    constructor() {
        super();

        this.state = {
            show: true,
            bedrooms: null,
            bathrooms: null,
            receptions: null,
        };
    }

    handleChangeArea = (a,b) => {
        this.setState({area: b.value});
    };

    getCollapsedText = () => {
        return "Rooms: " + this.state.area;
    };


    renderBody() {
        const {bedrooms, bathrooms, receptions} = this.state;

        return (
            <Fragment>
                <h3>Rooms</h3>
                <Header style={{marginTop: 0}} size='small'><i className="fas fa-bed"/> How many bedrooms do you
                    need?</Header>
                <Range
                    defaultValue={[1, 10]}
                    step={1}
                    min={1}
                    max={10}
                    marks={bedroomsRange()}
                    onChange={(a) => this.setState({data: {...this.state.data, num_bedrooms_min: a}})}
                />

                <br/>
                <Divider/>
                <Header style={{marginTop: 0}} size='small'><i className="fas fa-toilet"/> How many bathrooms do
                    you need?</Header>
                <Range
                    defaultValue={[1, 10]}
                    step={1}
                    min={1}
                    max={10}
                    marks={bedroomsRange()}
                    onChange={(a) => this.setState({data: {...this.state.data, num_bedrooms_min: a}})}
                />

                <br/>
                <Divider/>
                <Header style={{marginTop: 0}} size='small'><i className="fas fa-couch"/> How many reception
                    areas do you need?</Header>
                <Range
                    defaultValue={[1, 10]}
                    step={1}
                    min={1}
                    max={10}
                    marks={bedroomsRange()}
                    onChange={(a) => this.setState({data: {...this.state.data, num_bedrooms_min: a}})}
                />
                <br/>
            </Fragment>
        )
    }
}