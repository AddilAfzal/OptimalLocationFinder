import React, {Component} from "react";
import {
    Button
} from 'semantic-ui-react'
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";

export default class BaseFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        if (new.target === BaseFilter) {
            throw new TypeError("Cannot construct BaseFilter instances directly");
        }

        // if(Object.keys(props.show).indexOf(new.target.name) > -1 && props.show[new.target.name] === true ) {
        //     this.state.show = true;
        // }

        console.log("testing");
    }

    renderCollapsed() {
        return (<div>
            {this.getCollapsedText()}
        </div>)
    }

    render() {
        return (
            <div className="ui segments">
                <div className="ui segment">
                    {this.state.show ? [this.renderBody(), this.renderNext()] : this.renderCollapsed()}
                </div>
                <div className="ui segment">
                    <p><a>Change</a></p>
                </div>
            </div>)
    }

    renderNext() {
        return (
            <div style={{textAlign: 'right'}}>
                <Button primary disabled={this.state.listing_status === null}>Next</Button>
            </div>
        )
    }
}