import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label, Modal, Image
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';
import PropertyTypeFilter from "./filters/PropertyTypeFilter";
import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";
import DistanceFilter from "./filters/DistanceFilter";
import PriceFilter from "./filters/PriceFilter";
import AddFilterModal from "./AddFIlterModal";


const options = [
    {key: 'm', text: 'Male', value: 'male'},
    {key: 'f', text: 'Female', value: 'female'},
];


export default class filters extends Component {
    constructor() {
        super();

        this.state = {
            show: {
                PropertyTypeFilter: true,
                AreaFilter: true,
                RoomsFilter: false,
                PriceFilter: false,
                DistanceFilter: false,
            },
            filters: [],
            data: {
                'listing_status': null,
                'area': null,
                'price': null,
                'num_bedrooms': null,
                'num_bathrooms': null,
                'num_floors': null,
                'num_recepts': null, 'costFactor': {},
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
                <Button primary size="large" onClick={() => this.setState({show: true})}>
                    Start
                </Button>
                <Fragment>
                    <br/>
                    <br/>
                    <hr/>
                    {this.state.filters}
                    <p>
                        Please select at least one filter to apply.
                    </p>
                    {/*<PropertyTypeFilter updateState={this.updateState} show={this.state.show}/>*/}
                    {/*<AreaFilter updateState={this.updateState} show={this.state.show}/>*/}
                    {/*<RoomsFilter updateState={this.updateState} show={this.state.show}/>*/}
                    {/*<PriceFilter updateState={this.updateState} show={this.state.show}/>*/}
                    {/*<DistanceFilter updateStatus={this.updateState} show={this.state.show}/>*/}

                    <AddFilterModal filters={this.state.filters} updateFilters={(filters) => this.setState({filters})}/>

                    <div style={{textAlign: 'right'}}>
                        { this.state.filters.length > 0 && <Button size={'large'} primary>Submit</Button> }
                    </div>

                </Fragment>
            </div>
        )
    }
}