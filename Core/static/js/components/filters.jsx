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

    printData = () => {
        console.log(
            this.state.filters
                .map(f => f.ref.current.getData())
                .reduce((obj, item) => {
                    let key = Object.keys(item)[0];
                    obj[key] = item[key];
                    return obj;
                })
        );
    };

    removeFilter = (f) => {
        let key = f.props["data-key"];
        let filters = this.state.filters.filter((f) => parseInt(f.key) !== key);
        this.setState({filters})
    };


    render() {
        const {filters} = this.state;

        return (
            <div>
                <Button primary size="large" onClick={() => this.setState({show: true})}>
                    Start
                </Button>
                <Fragment>
                    <br/>
                    <br/>
                    <hr/>
                    {filters}
                    <p>
                        Please select at least one filter to apply.
                    </p>

                    <AddFilterModal
                        filters={this.state.filters}
                        addFilter={(f) => this.setState({filters: [...this.state.filters, f]})}
                        removeFilter={this.removeFilter}
                    />

                    <div style={{textAlign: 'right'}}>
                        { this.state.filters.length > 0 && <Button size={'large'} primary>Submit</Button> }
                    </div>
                    <Button onClick={this.printData}>Print data</Button>
                </Fragment>
            </div>
        )
    }
}