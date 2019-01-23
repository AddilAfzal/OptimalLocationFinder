import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Divider, Segment
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Range} from "rc-slider";


export default class PriceFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.area = null;
    }

    getCollapsedText = () => {
        return "Price: " + this.state.area;
    };


    renderBody() {
        const {data} = this.state;

        return (
            <Fragment>
                <h3>Price</h3>
                <Header style={{marginTop: 0}} size='small'>What is you price range?</Header>
                <Divider horizontal/>
                <Range
                    defaultValue={[0, 10]}
                    step={1}
                    max={9}
                    marks={salesPriceRange()}
                />
                <Divider horizontal/>
            </Fragment>
        )
    }
}