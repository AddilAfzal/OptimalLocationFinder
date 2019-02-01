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
    constructor(props) {
        super(props);

        this.state.bedrooms = {min: 3, max: 4};
        this.state.bathrooms = {min: 1, max: 2};
        this.state.receptions = {min: 1, max: 1};
    }

    static description = "Select the number of each type of room needed.";

    getData = () => {
        let { bedrooms, bathrooms, receptions} = this.state;
        return {
            'rooms': {
                num_bathrooms_min: bathrooms.min,
                num_bathrooms_max: bathrooms.max,
                num_recepts_min: receptions.min,
                num_recepts_max: receptions.max,
                num_bedrooms_min: bedrooms.min,
                num_bedrooms_max: bedrooms.max,
            }
        };
    };

    getCollapsedText = () => {
        const {bedrooms, bathrooms, receptions} = this.state;
        return (
            <Fragment>
                <h3>Rooms</h3>
                {bedrooms.min && <p><i className="fas fa-bed"/> Bedrooms {bedrooms.min}-{bedrooms.max}</p>}
                {bathrooms.min && <p><i className="fas fa-toilet"/> Bathrooms {bathrooms.min}-{bathrooms.max}</p>}
                {receptions.min && <p><i className="fas fa-couch"/> Receptions {receptions.min}-{receptions.max}</p>}
            </Fragment>
        )
    };

    renderBody() {
        const {bedrooms, bathrooms, receptions} = this.state;

        return (
            <Fragment>
                <h3>Rooms</h3>
                <Header style={{marginTop: 0}} size='small'><i className="fas fa-bed"/> How many bedrooms do you
                    need?</Header>
                <Range
                    defaultValue={bedrooms.min ? [bedrooms.min, bedrooms.max] : [1, 10]}
                    step={1}
                    min={1}
                    max={10}
                    marks={bedroomsRange()}
                    onChange={(a) => this.setState({bedrooms: {min: a[0], max: a[1]}})}
                />

                <br/>
                <Divider/>
                <Header style={{marginTop: 0}} size='small'><i className="fas fa-toilet"/> How many bathrooms do
                    you need?</Header>
                <Range
                    defaultValue={bathrooms.min ? [bathrooms.min, bathrooms.max] : [1, 10]}
                    step={1}
                    min={1}
                    max={10}
                    marks={bedroomsRange()}
                    onChange={(a) => this.setState({bathrooms: {min: a[0], max: a[1]}})}
                />

                <br/>
                <Divider/>
                <Header style={{marginTop: 0}} size='small'><i className="fas fa-couch"/> How many reception
                    areas do you need?</Header>
                <Range
                    defaultValue={receptions.min ? [receptions.min, receptions.max] : [1, 5]}
                    step={1}
                    min={1}
                    max={10}
                    marks={bedroomsRange()}
                    onChange={(a) => this.setState({receptions: {min: a[0], max: a[1]}})}
                />
                <br/>
            </Fragment>

        )
    }
}