import React, {Component, Fragment} from "react";
import {
    Button, Header, Form, Dropdown, List
} from 'semantic-ui-react'

import {Segment} from 'semantic-ui-react'
import BaseFilter from "./BaseFilter";


export default class SchoolFilter extends BaseFilter {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        super.componentDidMount();

    }

    static description = "Distance from nearest school meeting specific requirements.";

    getCollapsedText = () => {
        // let {propertyTypes} = this.state;
        return (
            <Fragment>
                <h3>School</h3>
            </Fragment>
        )
    };

    getData = () => {
        return {'school': {}};
    };

    renderBody() {
        // const {, options} = this.state;

        return (
            <Fragment>
                <h3>School</h3>
                <Header style={{marginTop: 0}} size='small'>What type of school are you looking for?</Header>

            </Fragment>
        )
    }

    isValid = () => {
        return true;
    };
}