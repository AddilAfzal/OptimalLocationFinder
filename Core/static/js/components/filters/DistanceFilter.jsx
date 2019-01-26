import React, {Component, Fragment} from "react";
import {
    Header, Form, Label
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";


export default class DistanceFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state.distance = [
            {distance: "2", from: "City, University of London"}
        ];
    }

    static description = "Filter for homes that are within a defined radius from a location.";

    getData = () => {
        return {'distance': this.state.distance};
    };

    handleChangeDistance = (a,b) => {
        this.setState({area: b.value});
    };

    // getCollapsedText = () => {
    //     let table_rows = this.state.distance.map((item) => {
    //         return (
    //             <tr>
    //                 <td>
    //                     {item.from}
    //                 </td>
    //                 <td>
    //                     {item.distance}KM
    //                 </td>
    //             </tr>
    //         )
    //     });
    //
    //     return (
    //         <Fragment>
    //             <h3>Distance</h3>
    //             <table className="ui celled table">
    //                 <thead>
    //                 <tr>
    //                     <th>Location</th>
    //                     <th>Max distance</th>
    //                 </tr>
    //                 </thead>
    //                 <tbody>
    //                 {table_rows}
    //                 </tbody>
    //             </table>
    //         </Fragment>
    //     )
    // };
    getCollapsedText = () => {
        let table_rows = this.state.distance.map((item) => {
            return (
                <span>{item.from} {item.distance}KM</span>
            )
        });

        return (
            <Fragment>
                <h3>Distance</h3>
                {table_rows}

            </Fragment>
        )
    };


    // getCollapsedText = () => {
    //     return [
    //         <h3>Distance</h3>,
    //         <table className="ui celled table">
    //             <thead>
    //             <tr>
    //                 <th>Location</th>
    //                 <th>Max distance</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             <tr>
    //                 <td data-label="Location">Work</td>
    //                 <td data-label="Age">12KM</td>
    //             </tr>
    //             <tr>
    //                 <td data-label="Location">University</td>
    //                 <td data-label="Age">11KM</td>
    //             </tr>
    //             <tr>
    //                 <td data-label="Location">Airport</td>
    //                 <td data-label="Age">25.2KM</td>
    //             </tr>
    //             </tbody>
    //         </table>
    //     ];
    //
    //     // return "Distance: " + this.state.area;
    // };


    renderBody() {
        const {data} = this.state;

        return (
            <Fragment>
                <h3>Distance</h3>
                <Form.Group inline>
                    {/*<label>Where should the property be situated?</label>*/}
                    <Header size='small'>Where should the property be located?</Header>
                    <Form.Input
                        width={7}
                        fluid
                        placeholder='London, West Midlands EC1 V,'
                        onChange={this.handleChangeArea}
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
            </Fragment>
        )
    }
}