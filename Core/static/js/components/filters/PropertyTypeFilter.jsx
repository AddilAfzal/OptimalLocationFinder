import React, {Component, Fragment} from "react";
import {
    Button, Header, Form
} from 'semantic-ui-react'

import {Segment} from 'semantic-ui-react'
import BaseFilter from "./BaseFilter";


export default class PropertyTypeFilter extends BaseFilter {
    constructor() {
        super();

        this.state = {
            listing_status: null,
        };
    }

    getCollapsedText = () => {
        return "Listing Status: " + this.state.listing_status;
    };

    handleChangeListingStatus = (e, {value}) => {
        this.setState({listing_status: value});
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