import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';
import PropertyTypeFilter from "./filters/PropertyTypeFilter";
import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";


const options = [
    {key: 'm', text: 'Male', value: 'male'},
    {key: 'f', text: 'Female', value: 'female'},
];

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

    updateState = (state) => {
        this.setState(state);
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
                    <PropertyTypeFilter updateState={this.updateState}/>
                    {/*Area*/}
                    <AreaFilter updateState={this.updateState}/>
                    {/*Rooms*/}
                    <RoomsFilter updateState={this.updateState}/>
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