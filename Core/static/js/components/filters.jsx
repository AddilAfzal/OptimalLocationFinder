import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';


const options = [
    {key: 'm', text: 'Male', value: 'male'},
    {key: 'f', text: 'Female', value: 'female'},
];

function formatCurrency(i) {
    return new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((i))
}

function bedroomsRange() {
    let values = {};

    for (let i = 1; i <= 10; i += 1) {
        values[i] = (i == 10) ? i + "+" : i;
    }

    return values;
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

export default class filters extends Component {
    constructor() {
        super();

        this.state = {
            show: true,
            data: {
                'listing_status': null,
                'area': null,
                'price': null,
                'num_bedrooms': null,
                'num_bathrooms': null,
                'num_floors': null,
                'num_recepts': null,
                'costFactor': {},
            }
        };
    }

    handleChangeListingStatus = (e, {value}) => {
        console.log(e, value);
        let data = this.state.data;
        data['listing_status'] = value;
        this.setState({data});
    };

    render() {
        const {data} = this.state;

        return (
            <div>
                <Button primary size="large" onClick={() => this.setState({show: true})}
                        disabled={this.state.show}>Start</Button>
                {this.state.show &&
                <Fragment>
                    <br/>
                    <br/>
                    <hr/>
                    {/*Property type*/}
                    <Segment>
                        <h3>Property type</h3>
                        <Header style={{marginTop: 0}} size='small'>What type of property are you looking for?</Header>
                        <Form.Group inline>
                            <Form.Radio
                                label='Rent'
                                value='rent'
                                checked={data['listing_status'] === 'rent'}
                                onChange={this.handleChangeListingStatus}
                            />
                            <Form.Radio
                                label='Sale'
                                value='sale'
                                checked={data['listing_status'] === 'sale'}
                                onChange={this.handleChangeListingStatus}
                            />
                        </Form.Group>
                        <div style={{textAlign: 'right'}}>
                            <Button primary disabled>Next</Button>
                        </div>
                    </Segment>
                    {/*Area*/}
                    <Segment>
                        <h3>Area</h3>
                        <Form.Group inline>
                            {/*<label>Where should the property be situated?</label>*/}
                            <Header size='small'>Where should the property be located?</Header>
                            <Form.Input
                                width={7}
                                fluid
                                placeholder='London, West Midlands EC1 V,'
                                onChange={(a, b) => this.setState({data: {...this.state.data, area: b.value}})}
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
                    </Segment>
                    {/*Rooms*/}
                    <Segment>
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

                    </Segment>
                    {/*Price*/}
                    <Segment>
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


                    </Segment>

                    <Form.Button>Submit</Form.Button>
                </Fragment>


                }

            </div>
        )
    }
}