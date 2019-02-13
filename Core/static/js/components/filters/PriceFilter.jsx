import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Divider, Segment, Button
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Range} from "rc-slider";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

function formatCurrency(i) {
    let s = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((i));
    return s.substring(0, (s.length) - 3)
}


function salesPriceRange() {
    let values = {};

    for (let i = 0; i <= 60; i += 1) {
        if(i % 5 === 0) {
            values[i] = formatCurrency(i * 25000);
        } else {
            values[i] = "";
        }

    }
    return values;
}
function rentalPriceRange() {
    let values = {};

    for (let i = 0; i <= 90; i += 1) {
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

        this.state = {
            ...this.state,
            canRemove: false,
            term: 'month', // Week/Month
            listingType: props.data.listingType.listing_status,
            chartData: null,
        }

        this.state.price = this.state.listingType === 'sale' ? [0, 1500000] : [0, 4500];
    }

    static description = "price...";

    getData = () => {
        let { price, term, listingType } = this.state;

        let tmp = {};
        if(listingType === 'rent') {
            tmp[`rentalprice__per_${term}_min`] = price[0];
            tmp[`rentalprice__per_${term}_max`] = price[1];
        } else {
            tmp['price_min'] = price[0];
            tmp['price_max'] = price[1];
        }

        return {
            'price': tmp
        };
    };

    componentDidMount() {
        super.componentDidMount();
        let price = this.props.data.price;
        let listingType = this.props.data.listingType;

        if(price && listingType && listingType.listing_status === 'rent') {
            const {rentalprice__per_month_min,
                rentalprice__per_month_max,
                rentalprice__per_week_min,
                rentalprice__per_week_max,
                } = price;

            this.state.price = [rentalprice__per_month_min | rentalprice__per_week_min,
                rentalprice__per_month_max | rentalprice__per_week_max];
            this.state.term = rentalprice__per_week_max !== undefined ? 'week': 'month';
            this.save();
        } else if(price && listingType && listingType.listing_status === 'sale') {
            this.state.price = [price.price_min, price.price_max];
            this.state.listingType = listingType.listing_status;
            this.save();
        }
        this.fetchChartData()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log(nextProps, this.state)
        if(nextProps.data.listingType.listing_status !== this.state.listingType) {
            this.setState({
                listingType: nextProps.data.listingType.listing_status,
                price: [0, 0],
                term: null,
                needsReview: true
            }, this.fetchChartData);
        }
    }

    getCollapsedText = () => {
        let { price, term, listingType } = this.state;
        return (
            <Fragment>
                <h3>Price</h3>
                <p>{formatCurrency(price[0])} - {formatCurrency(price[1])}{listingType === 'rent' && '/' + term}</p>
            </Fragment>
        )
    };

    fetchChartData = async () => {
        const tmp = this.state.listingType === 'sale' ? 'get_sales_histogram' : 'get_rental_histogram';
        const chartData = await fetch(`/api/${tmp}/`).then(x => x.json());
        await this.setState({chartData});
    };

    handleChangePriceTerm = (elmm, a) => {
        this.setState({term: a.value})
    };

    renderBody() {
        const {term, price, listingType, chartData} = this.state;

        return (
            <Fragment>
                <h3>Price</h3>

                {listingType === 'rent' && [<Form.Group inline>
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
                </Form.Group>]}
                <br/>
                <Header style={{marginTop: 0}} size='small'>Range</Header>
                {formatCurrency(price[0])} - {formatCurrency(price[1])}
                <br/>
                <br/>

                {chartData &&
                <div style={{height: 100}}>
                    <ResponsiveContainer>
                        <AreaChart
                            data={chartData}
                            // margin={{top: 20, right: 20, bottom: 20, left: 20,}}
                        >
                            {/*<XAxis dataKey="price"/>*/}
                            {/*<YAxis dataKey="value"/>*/}
                            <Area dataKey="value" label="Price" stroke="#838d92" fill="#abe2fb"/>
                            <Tooltip/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>}

                <Range
                    defaultValue={[0,0]}
                    value={price.map(x => x/(listingType === 'rent' ? 50 : 25000))}
                    step={1}
                    max={listingType === 'rent' ? 90 : 60}
                    onChange={(price) => this.setState({price: price.map(x => x * (listingType === 'rent' ? 50 : 25000))})}
                    marks={listingType === 'rent' ? rentalPriceRange() : salesPriceRange()}
                />
                <Divider horizontal/>
            </Fragment>
        )
    }
}