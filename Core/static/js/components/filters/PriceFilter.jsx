import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Divider, Segment, Button
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

        this.state.price = [0,0];
        this.state.term = null; // Weekly/Monthly
    }

    static description = "price...";

    getData = () => {
        let { price, term } = this.state;
        return {
            'price': {
                price: {min: price[0], max: price[1]},
                term,
            }
        };
    };

    getCollapsedText = () => {
        let { price, term } = this.state;

        return (
            <Fragment>
                <h3>Price</h3>
                <p>{formatCurrency(price[0])} - {formatCurrency(price[1])}/{term}</p>
            </Fragment>
        )
    };

    handleChangePriceTerm = (elmm ,a ) => {
        this.setState({term: a.value})
    };

    renderBody() {
        const {term} = this.state;

        return (
            <Fragment>
                <h3>Price</h3>
                <Form.Group inline>
                    <Form.Radio
                        label='Per Week'
                        value='week'
                        checked={term === 'week'}
                        onChange={this.handleChangePriceTerm}
                    />
                    <Form.Radio
                        label='Per Month'
                        value='month'
                        checked={term === 'month'}
                        onChange={this.handleChangePriceTerm}
                    />
                </Form.Group>

                <br/>
                <Header style={{marginTop: 0}} size='small'>Range</Header>
                <Range
                    defaultValue={[0, 10]}
                    step={1}
                    max={9}
                    onChange={(price) => this.setState({price})}
                    marks={salesPriceRange()}
                />
                <Divider horizontal/>
            </Fragment>
        )
    }
}