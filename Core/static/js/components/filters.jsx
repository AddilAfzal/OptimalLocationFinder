import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label
} from 'semantic-ui-react'

import { Divider, Segment } from 'semantic-ui-react'

// import Slider, { Range } from 'rc-slider';


const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
];

export default class filters extends Component {
    constructor() {
        super();

        this.state = {
            show: true,
            data: {
                'searchType': null,
                'area': null,
                'costFactor': {

                },
            }
        };
    }

    handleChangeSearchType = (e, { value }) =>
    {
        console.log(e, value);
        let data = this.state.data;
        data['searchType'] = value;
        this.setState({ data });
    };

    handleChangePriceMin = (event, { value }) => {
        event.preventDefault();
        console.log(event);
        console.log(value);
    };

    handleChangePriceMax = (event, { value }) => {
        event.preventDefault();
        console.log(event);
        console.log(value);
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
                                        value='r'
                                        checked={data['searchType'] === 'r'}
                                        onChange={this.handleChangeSearchType}
                                    />
                                    <Form.Radio
                                        label='Sale'
                                        value='s'
                                        checked={data['searchType'] === 's'}
                                        onChange={this.handleChangeSearchType}
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
                                        labelPosition='top'
                                        placeholder='London, West Midlands EC1 V,'
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

                                <Form.Group inline widths='equal'>
                                    <Form.Input
                                        fluid
                                        placeholder='Any'
                                        label='Bedrooms'
                                        type='number'
                                        min={0}
                                    />
                                    <Form.Input
                                        fluid
                                        placeholder='Any'
                                        label='Bathrooms'
                                        type='number'
                                        min={0}
                                    />
                                    <Form.Input
                                        fluid
                                        placeholder='Any'
                                        label='Kitchens'
                                        type='number'
                                        min={0}
                                    />
                                </Form.Group>

                                {/*<Divider horizontal>*/}
                                    {/*Price*/}
                                {/*</Divider>*/}

                                <Header size='small'>Price</Header>

                                <Form.Group inline widths='equal'>
                                    <Form.Input
                                        fluid
                                        placeholder='No min'
                                        label='Min'
                                        type='number'
                                        min={0}
                                        onChange={this.handleChangePriceMin}
                                    />
                                    <Form.Input
                                        fluid
                                        placeholder='No max'
                                        label='Max'
                                        type='number'
                                        min={0}
                                        onChange={this.handleChangePriceMax}
                                    />
                                </Form.Group>
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