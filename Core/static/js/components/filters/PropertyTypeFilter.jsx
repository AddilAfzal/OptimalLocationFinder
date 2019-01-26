import React, {Component, Fragment} from "react";
import {
    Button, Header, Form
} from 'semantic-ui-react'

import {Segment} from 'semantic-ui-react'
import BaseFilter from "./BaseFilter";


export default class PropertyTypeFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.listing_status = null;

    }

    static description = "Type of listing...";

    getCollapsedText = () => {
        return (
            <Fragment>
                <h3>Property type</h3>
                <p>{this.state.area}</p>
            </Fragment>
        )
    };

    handleChangeListingStatus = (e, {value}) => {
        this.setState({listing_status: value});
    };

    getData = () => {
        return {'property_type': this.state.listing_status};
    };

    renderBody() {
        const {listing_status} = this.state;

        return (
            <Fragment>
                <h3>Property type</h3>
                <Header style={{marginTop: 0}} size='small'>What type of property are you looking for?</Header>
                <Form.Group inline>
                    <Form.Radio
                        label='Rent'
                        value='rent'
                        checked={listing_status === 'rent'}
                        onChange={this.handleChangeListingStatus}
                    />
                    <Form.Radio
                        label='Sale'
                        value='sale'
                        checked={listing_status === 'sale'}
                        onChange={this.handleChangeListingStatus}
                    />
                </Form.Group>
            </Fragment>

        )
    }
}