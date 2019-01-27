import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Divider, Segment, Button
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Range} from "rc-slider";

function formatCurrency(i) {
    let s = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((i));
    return s.substring(0, (s.length) - 3)
}


function salesPriceRange() {
    let values = {};

    for (let i = 0; i <= 50; i += 1) {
        if(i % 8 === 0) {
            values[i] = formatCurrency(i * 25000);
        } else {
            values[i] = "";
        }

    }
    return values;
}
function rentalPriceRange() {
    let values = {};

    for (let i = 0; i <= 50; i += 1) {
        if(i % 5 === 0) {
            values[i] = formatCurrency(i * 50);
        } else {
            values[i] = "";
        }

    }
    return values;
}

export default class PriceFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.canRemove = false;
        this.state.price = [0,0];
        this.state.term = 'month'; // Week/Month
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

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps);
        console.log("Receiving props")
    }

    getCollapsedText = () => {
        let { price, term } = this.state;
        // console.log(this.props)
        return (
            <Fragment>
                <h3>Price</h3>
                <p>{formatCurrency(price[0])} - {formatCurrency(price[1])}{this.props.data.property_type === 'rent' && '/' + term}</p>
            </Fragment>
        )
    };

    handleChangePriceTerm = (elmm, a) => {
        this.setState({term: a.value})
    };

    renderBody() {
        const {term, price} = this.state;
        let propertyData = this.props.data;

        return (
            <Fragment>
                <h3>Price</h3>

                {propertyData.property_type === 'rent' && [<Form.Group inline>
                    <Form.Radio
                        label='Per Month'
                        value='month'
                        checked={term === 'month'}
                        onChange={this.handleChangePriceTerm}
                    />
                    <Form.Radio
                        label='Per Week'
                        value='week'
                        checked={term === 'week'}
                        onChange={this.handleChangePriceTerm}
                    />
                </Form.Group>, <br/>]}

                <Header style={{marginTop: 0}} size='small'>Range</Header>
                {formatCurrency(price[0])} - {formatCurrency(price[1])}
                <br/>
                <br/>
                <Range
                    defaultValue={[0, 10]}
                    value={price.map(x => x/(propertyData.property_type === 'rent' ? 50 : 25000))}
                    step={1}
                    max={50}
                    onChange={(price) => this.setState({price: price.map(x => x * (propertyData.property_type === 'rent' ? 50 : 25000))})}
                    marks={propertyData.property_type === 'rent' ? rentalPriceRange() : salesPriceRange()}
                />
                <Divider horizontal/>
            </Fragment>
        )
    }
}