import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Divider, Segment
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Range} from "rc-slider";

function formatCurrency(i) {
    return new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((i))
}


function salesPriceRange() {
    let values = {};

    for (let i = 0; i <= 9; i += 1) {
        if ((i < 6)) {
            let k = formatCurrency(i * 100000);
            values[i] = k.substring(0, (k.length) - 3)
        } else if (i in [7, 8]) {
            values[i] = formatCurrency(i * 100000)
        }
    }
    return values;
}

export default class PriceFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.min_price = 100;
        this.state.max_price = 200;
        this.state.term = "weekly"; // Weekly/Monthly
    }

    static description = "price...";

    getData = () => {
        let { max_price, term, min_price } = this.state;
        return {
            'price': {
                min_price,
                max_price,
                term,
            }
        };
    };

    getCollapsedText = () => {
        let { max_price, term, min_price } = this.state;

        return (
            <Fragment>
                <h3>Price</h3>
                <p>{formatCurrency(min_price)} - {formatCurrency(max_price)}/{term}</p>
            </Fragment>
        )
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