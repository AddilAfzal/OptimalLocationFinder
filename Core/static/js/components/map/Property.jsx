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
                    <Header as='h3' attached='top'>
                        Property
                    </Header>
                    <Segment attached>
                        <h5> {property.street_name}, {property.outcode}</h5>
                        <Button onClick={() => window.open(property.details_url)}>Zoopla</Button>
                        {property.propertyimage_set.map(x => <Image src={x.url}/>)}
                    </Segment>

                </Fragment>
            )
        } else {
            return "";
        }
        // else {
        //     return (
        //         <Fragment>
        //             Click on a property to see more information about it here.
        //         </Fragment>)
        // }
    }
}