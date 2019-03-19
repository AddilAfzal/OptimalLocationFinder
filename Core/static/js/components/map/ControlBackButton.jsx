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

    performAction = async () => {
        await this.props.action();
    };

    render() {
        const {property, mapContents} = this.props;

        if (property && mapContents) {
            return <Control position="topright">
                    <Button onClick={this.performAction} secondary>Back</Button>
                </Control>
        } else {
            return ""
        }
    }
}