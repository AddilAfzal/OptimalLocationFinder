import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label
} from 'semantic-ui-react'

import { Divider, Segment } from 'semantic-ui-react'
import Slider, { Range } from 'rc-slider';


const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
];

function formatCurrency(i) {
    return new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((i))
}

function bedroomsRange() {
    let values = {};

    for (let i = 1; i <= 10; i += 1) {
        values[i] = (i == 10) ?  i + "+" : i;
    }

    return values;
}

function salesPriceRange () {
    let values = {};

    for (let i = 0; i <= 9; i += 1) {
        if((i < 6)) {
            values[i] = formatCurrency(i*100000)
        } else if(i in [7,8]) {
            values[i] = formatCurrency(i*100000)
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
                'costFactor': {

                },
            }
        };
    }

    handleChangeListingStatus = (e, { value }) =>
    {
        console.log(e, value);
        let data = this.state.data;
        data['listing_status'] = value;
        this.setState({ data });
    };

    render() {
        const { data } = this.state;

        return (
            <div>
                <Button primary size="large" onClick={ () => this.setState({show: true}) } disabled={this.state.show}>Start</Button>
                { this.state.show &&
                    <Fragment>
                        <br/>
                        <br/>
                        <hr/>
                        <Segment>
                            <Form loading={false}>
                                <Header as='h2'>Property basics</Header>
                                {/*<Divider/>*/}
                                <Header size='small'>What type of property are you looking for?</Header>
                                <Form.Group inline>
                                    {/*<label>What type of property are you looking for?</label>*/}
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

                                {/*<Divider horizontal>*/}
                                    {/*Area*/}
                                {/*</Divider>*/}

                                <Header size='small'>Area</Header>


                                <Form.Group inline>
                                    {/*<label>Where should the property be situated?</label>*/}
                                    <Form.Input
                                        width={7}
                                        fluid
                                        label='Area'
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

                                {/*<Divider horizontal>*/}
                                    {/*Rooms*/}
                                {/*</Divider>*/}

                                <Header size='small'>Rooms</Header>
                                <Range
                                    defaultValue={[1,10]}
                                    step={1}
                                    min={1}
                                    max={10}
                                    marks={bedroomsRange()}
                                        onChange={(a) => this.setState({data: {...this.state.data, num_bedrooms_min: a}})}
                                />


                                {/*<Form.Group inline widths='equal'>*/}
                                    {/*<Form.Input*/}
                                        {/*fluid*/}
                                        {/*placeholder='Any'*/}
                                        {/*label='Bedrooms'*/}
                                        {/*type='number'*/}
                                        {/*min={0}*/}
                                    {/*/>*/}
                                    {/*<Form.Input*/}
                                        {/*fluid*/}
                                        {/*placeholder='Any'*/}
                                        {/*label='Bathrooms'*/}
                                        {/*type='number'*/}
                                        {/*min={0}*/}
                                    {/*/>*/}
                                    {/*<Form.Input*/}
                                        {/*fluid*/}
                                        {/*placeholder='Any'*/}
                                        {/*label='Kitchens'*/}
                                        {/*type='number'*/}
                                        {/*min={0}*/}
                                    {/*/>*/}
                                {/*</Form.Group>*/}

                                {/*<Divider horizontal>*/}
                                    {/*Price*/}
                                {/*</Divider>*/}

                                <br/>
                                <Header size='small'>Price</Header>

                                <Range
                                    defaultValue={[0,10]}
                                    step={1}
                                    max={9}
                                    marks={salesPriceRange()}
                                />
                                {/*<Form.Group inline widths='equal'>*/}
                                    {/*<Form.Input*/}
                                        {/*fluid*/}
                                        {/*placeholder='No min'*/}
                                        {/*label='Min'*/}
                                        {/*type='number'*/}
                                        {/*min={0}*/}
                                        {/*onChange={this.handleChangePriceMin}*/}
                                    {/*/>*/}
                                    {/*<Form.Input*/}
                                        {/*fluid*/}
                                        {/*placeholder='No max'*/}
                                        {/*label='Max'*/}
                                        {/*type='number'*/}
                                        {/*min={0}*/}
                                        {/*onChange={this.handleChangePriceMax}*/}
                                    {/*/>*/}
                                {/*</Form.Group>*/}
                                <br/>
                                <Form.Button>Submit</Form.Button>
                            </Form>
                        </Segment>
                    </Fragment>


                }

            </div>
        )
    }
}