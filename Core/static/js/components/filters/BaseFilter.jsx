import React, {Component} from "react";
import {
    Button
} from 'semantic-ui-react'
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";

export default class BaseFilter extends Component {
    constructor() {
        super();

        if (new.target === BaseFilter) {
            throw new TypeError("Cannot construct BaseFilter instances directly");
        }
    }

    renderCollapsed() {
        return (<div>
            {this.getCollapsedText()}
        </div>)
    }

    render() {
        return (<Segment>
            {this.state.show ? [this.renderBody(), this.renderNext()] : this.renderCollapsed()}
            <a>Change</a>
        </Segment>)
    }

    renderNext() {
        return (
            <div style={{textAlign: 'right'}}>
                <Button primary disabled={this.state.listing_status === null}>Next</Button>
            </div>
        )
    }
}