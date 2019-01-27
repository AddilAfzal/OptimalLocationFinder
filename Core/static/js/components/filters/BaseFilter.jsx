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

        this.state.canRemove = true;
        this.state.collapse = false;
    }

    removeFilter = () => {
        this.props.removeFilter(this);
    };

    isValid = () => {
        return true;
    };

    renderCollapsed() {
        return (
            <Fragment>
                <div className="ui segment">
                    {this.getCollapsedText()}
                </div>
                <div className="ui segment">
                    <p><a href="javascript:void(0)" onClick={() => this.setState({collapse: false})}>Change</a></p>
                    { this.state.canRemove && <p><a href="javascript:void(0)" onClick={this.removeFilter}>Remove</a></p> }
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

    collapse = () => {
        this.setState({collapse: true})
    };

    save = () => {
        this.collapse();
        this.props.reloadData();
        if (this.props.hasOwnProperty("onFirstValid") && !this.hasOwnProperty('doneOnFirstValid')) {
            this.props.onFirstValid();
            this.doneOnFirstValid = true;
        }
    };

    renderSave() {
        return (
            <div style={{textAlign: 'right'}}>
                <Button onClick={this.save} primary disabled={!this.isValid()}>Done</Button>
            </div>
        )
    }
}