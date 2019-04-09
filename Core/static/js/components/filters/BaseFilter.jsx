import React, {Component, Fragment} from "react";
import {
    Button, Dimmer, Loader, Message, Segment
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

        props.enableLock();
    }

    componentDidMount() {
        setTimeout(() => this.setState({showLoader: false}),500);
    }

    removeFilter = () => {
        this.props.removeFilter(this);
        this.props.disableLock();
    };

    isValid = () => {
        return true;
    };

    renderCollapsed() {
        let reviewMessage =
          ( <Message warning>
                <Message.Header>Requires updating</Message.Header>
                <p>
                    A change to another filter means this will need to be updated.
                </p>
            </Message>);
        return (
            <Fragment>
                <Segment secondary={this.props.lock}>
                    {this.state.needsReview && reviewMessage}
                    {this.getCollapsedText()}
                </Segment>
                <Segment secondary={this.props.lock}>
                    <Button.Group labeled icon>
                        <Button icon="edit" href="javascript:void(0)" onClick={this.unCollapse} primary
                                disabled={this.props.lock} content={"Change"}  compact/>
                        {this.state.canRemove &&
                        <Button icon={"trash"} href="javascript:void(0)" onClick={this.removeFilter} color={"red"}
                                disabled={this.props.lock} compact content={"Remove"}/>}
                    </Button.Group>
                </Segment>
            </Fragment>)
    }

    render() {
        return (
            <Segment.Group>
                <Dimmer inverted active={this.state.showLoader}>
                    <Loader inverted content='Loading'/>
                </Dimmer>
                {this.state.collapse ? this.renderCollapsed() :
                    [<Segment> {this.renderBody()}</Segment>,
                    <Segment> {this.renderSave()}</Segment>]}
            </Segment.Group>)
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

        if(this.hasOwnProperty("onSave")) {
            this.onSave();
        }
    };

    renderSave() {
        return (
            <Fragment>
                { this.state.canRemove && <div style={{float: 'left', display: 'inline'}}>
                    <Button onClick={this.removeFilter} color="red">Remove</Button>
                </div> }
                <div style={{textAlign: 'right', display: 'block'}}>
                    <Button onClick={this.save} primary disabled={!this.isValid()}>Done</Button>
                </div>

            </Fragment>
        )
    }
}