import React, {Component, Fragment} from "react";
import {
    Button
} from 'semantic-ui-react'

export default class BaseFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        if (new.target === BaseFilter) {
            throw new TypeError("Cannot construct BaseFilter instances directly");
        }

        this.state.collapse = true;
    }

    removeFilter = () => {
        this.props.removeFilter(this);
    };

    renderCollapsed() {
        return (
            <Fragment>
                <div className="ui segment">
                    {this.getCollapsedText()}
                </div>
                <div className="ui segment">
                    <p><a href="javascript:void(0)" onClick={() => this.setState({collapse: false})}>Change</a></p>
                    <p><a href="javascript:void(0)" onClick={this.removeFilter}>Remove</a></p>
                </div>
            </Fragment>)
    }

    render() {
        return (
            <div className="ui segments">
                {this.state.collapse ? this.renderCollapsed() :
                    [<div className="ui segment"> {this.renderBody()}</div>,
                    <div className="ui segment"> {this.renderSave()}</div>]}
            </div>)
    }

    save = () => {
        this.setState({collapse: true});

    };

    renderSave() {
        return (
            <div style={{textAlign: 'right'}}>
                <Button onClick={this.save} primary>Done</Button>
            </div>
        )
    }
}