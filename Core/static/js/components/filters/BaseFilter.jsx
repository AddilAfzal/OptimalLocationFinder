import React, {Component, Fragment} from "react";
import {
    Button, Dimmer, Loader, Message
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
        this.state.needsReview = false;
        this.state.showLoader = true;

    }

    componentDidMount() {
        setTimeout(() => this.setState({showLoader: false}),500);
    }

    removeFilter = () => {
        this.props.removeFilter(this);
    };

    isValid = () => {
        return true;
    };

    renderCollapsed() {
        let reviewMessage =
          ( <Message>
                <Message.Header>Requires updating</Message.Header>
                <p>
                    A change to another filter means this will need to be updated.
                </p>
            </Message>);
        return (
            <Fragment>
                <div className="ui segment">
                    {this.state.needsReview && reviewMessage}
                    {this.getCollapsedText()}
                </div>
                <div className="ui segment">
                    <p><a href="javascript:void(0)" onClick={this.unCollapse}>Change</a></p>
                    { this.state.canRemove && <p><a href="javascript:void(0)" onClick={this.removeFilter}>Remove</a></p> }
                </div>
            </Fragment>)
    }

    render() {
        return (
            <div className="ui segments">
                <Dimmer inverted active={this.state.showLoader}>
                    <Loader inverted content='Loading'/>
                </Dimmer>
                {this.state.collapse ? this.renderCollapsed() :
                    [<div className="ui segment"> {this.renderBody()}</div>,
                    <div className="ui segment"> {this.renderSave()}</div>]}
            </div>)
    }

    collapse = () => {
        this.setState({collapse: true})
    };

    unCollapse = () => {
        this.props.enableLock();
        this.setState({collapse: false, needsReview: false})
    };

    save = () => {
        this.collapse();
        this.props.reloadData();
        this.props.disableLock();
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