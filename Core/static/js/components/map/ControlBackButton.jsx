import React, {Component, Fragment} from "react";
import Control from 'react-leaflet-control';
import {Button} from "semantic-ui-react";


export default class ControlBackButton extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.property !== this.props.property) {
            this.forceUpdate();
        }
    }

    render() {
        const {property, action} = this.props;

        if (property) {
            return <Control position="topright">
                    <Button onClick={action}>Back</Button>
                </Control>
        } else {
            return ""
        }
    }
}