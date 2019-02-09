import React, {Component, Fragment} from "react";
import {Card, Image} from "semantic-ui-react";
import Control from 'react-leaflet-control';

function formatPrice(property)
{
    if(property.listing_status === 'rent') {
        return `${Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((property.rentalprice_set[0].per_month))} pcm`
    } else {
        return new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((property.price))
    }
}

export default class ControlInfo extends Component {
    constructor(props) {
        super(props);
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.property !== this.props.property) {
            this.forceUpdate();
        }
    }

    render() {
        const {property} = this.props;

        if (property) {
            const description = (
                <Fragment>
                    <span><i className="fas fa-bed"/> Bedrooms {property.rooms.num_bedrooms} </span>
                    <span><i className="fas fa-toilet"/> Bathrooms {property.rooms.num_bathrooms} </span>
                    <span><i className="fas fa-couch"/> Receptions {property.rooms.num_recepts} </span>
                </Fragment>);

            return (
                <Control position="bottomleft">
                    <Image src={property.propertyimage_set[0].url} size='tiny' verticalAlign='middle'/>
                    <Card>
                        <Card.Content>
                            <Card.Header content={property.street_name}/>
                            <Card.Meta content={formatPrice(property)}/>
                            <Card.Description content={description}/>
                        </Card.Content>
                    </Card>
                </Control> )
        } else {
            return (
                <Control position="bottomleft">
                    <Card>
                        <Card.Content>
                            <Card.Description content='Click on a property to see more information about it here.'/>
                        </Card.Content>
                    </Card>
                </Control>)
        }
    }
}