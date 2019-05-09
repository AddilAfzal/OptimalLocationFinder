import React, {Component, Fragment} from "react";
import {Button, Divider, Header, Segment} from "semantic-ui-react";


export default class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
        }
    }

    componentDidMount() {
        this.props.updateMapContents(null, null);
    }

    render() {
        const {property} = this.props;
        const {loading} = this.state;

        const body = (
            <Fragment>
                <Button onClick={() => window.open(property.details_url,'_blank')} secondary>View on Zoopla</Button>
                <Divider/>
                <div dangerouslySetInnerHTML={{__html: property.short_description}}/>
                <h4>Address</h4>
                {property.street_name}, {property.outcode}
                <h4 style={{marginBottom: 0}}>First listed</h4>
                {property.first_published}
                <h4 style={{marginBottom: 0}}>Last updated</h4>
                {property.last_published}
            </Fragment>
        );
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Summary
                </Header>
                <Segment attached loading={loading}>
                    {body}
                </Segment>
            </Fragment>
        )
    }
}