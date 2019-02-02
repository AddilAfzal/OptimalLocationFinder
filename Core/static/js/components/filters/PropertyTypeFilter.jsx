import React, {Component, Fragment} from "react";
import {
    Button, Header, Form, Dropdown, List
} from 'semantic-ui-react'

import {Segment} from 'semantic-ui-react'
import BaseFilter from "./BaseFilter";


export default class PropertyTypeFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.canRemove = false;
        this.state.propertyTypes = [];
        this.state.options = [];
    }

    componentDidMount() {
        super.componentDidMount();
        const options = [
          { key: 'flat', text: 'Flat', value: 'Flat' },
          { key: 'terraced_house', text: 'Terraced house', value: 'Terraced house' },
          { key: 'semi-detached_house', text: 'Semi-detached house', value: 'Semi-detached house' },
          { key: 'detached_house', text: 'Detached house', value: 'Detached house' },
          { key: 'studio', text: 'Studio', value: 'Studio' },
          { key: 'maisonette', text: 'Maisonette', value: 'Maisonette' },
          { key: 'bungalow', text: 'Bungalow', value: 'Bungalow' },
          { key: 'cottage', text: 'Cottage', value: 'Cottage' },
          { key: 'land', text: 'Land', value: 'Land' },

        ];

        this.setState({options});

        let propertyTypes = this.props.data.propertyTypes;
        if(propertyTypes) {
            this.state.propertyTypes = propertyTypes.property_type;
            this.save();
        }
        // this.setState({propertyTypes: ['Flat']});
    }

    static description = "Type of property...";


    getCollapsedText = () => {
        let {propertyTypes} = this.state;
        return (
            <Fragment>
                <h3>Property type</h3>
                  <List bulleted horizontal>
                      { propertyTypes.map((value, index) => <List.Item key={index} as='span'>{value}</List.Item>)}
                  </List>
                {/*<p>{propertyTypes.reduce((x, i) => x + ", " + i)}</p>*/}
            </Fragment>
        )
    };

    getData = () => {
        return {'propertyTypes': {'property_type': this.state.propertyTypes}};
    };

    renderBody() {
        const {propertyTypes, options} = this.state;

        return (
            <Fragment>
                <h3>Property type</h3>
                <Header style={{marginTop: 0}} size='small'>What type of property are you looking for?</Header>
                <Dropdown
                    placeholder='Property type'
                    options={options}
                    value={propertyTypes}
                    onChange={(a, b) => this.setState({propertyTypes: b.value})}
                    fluid multiple selection />
            </Fragment>
        )
    }

    isValid = () => {
        return (this.state.propertyTypes).length > 0
    };
}