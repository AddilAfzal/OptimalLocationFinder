import React, {Component, Fragment} from "react";
import {Button, Divider, Header, Icon, Image, Segment} from "semantic-ui-react";

export default class Property extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {property} = this.props;
        if (property !== null) {
            return (

                <Fragment>
                    <br/>
                    <Button onClick={() => window.open(property.details_url)}>Zoopla</Button>
                </Fragment>
            )
        } else {
            return "";
        }
    }
}