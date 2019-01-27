import React, {Component, Fragment} from "react";
import {
    Button, Header, Form
} from 'semantic-ui-react'

import {Segment} from 'semantic-ui-react'
import BaseFilter from "./BaseFilter";


export default class PropertyTypeFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.canRemove = false;
        this.state.listing_status = null;
    }

    static description = "Type of listing...";

    getCollapsedText = () => {
        let {listing_status} = this.state;
        return (
            <Fragment>
                <h3>Listing type</h3>
                <p>{listing_status && (listing_status.charAt(0).toUpperCase() + listing_status.slice(1))}</p>
            </Fragment>
        )
    };

    handleChangeListingStatus = (e, {value}) => {
        this.setState({listing_status: value});
    };

    getData = () => {
        return {'listingType': this.state.listing_status};
    };

    renderBody() {
        const {listing_status} = this.state;

        return (
            <Fragment>
                <h3>Listing type</h3>
                <Header style={{marginTop: 0}} size='small'>What type of listing are you interested in?</Header>
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

    isValid = () => {
        return !!(this.state.listing_status)
    };
}