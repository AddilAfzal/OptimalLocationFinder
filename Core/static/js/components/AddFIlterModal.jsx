import React, {Component, Fragment} from "react";
import {
    Button, Header, Form, Modal, Image
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';
import ListingTypeFilter from "./filters/ListingTypeFilter";
import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";
import DistanceFilter from "./filters/DistanceFilter";
import PriceFilter from "./filters/PriceFilter";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import PropertyTypeFilter from "./filters/PropertyTypeFilter";


export default class AddFilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterMethods: [
                AreaFilter,
                RoomsFilter,
                DistanceFilter,
            ],
            open: false,
        };
    }

    open = () => this.setState({open: true});
    close = () => this.setState({open: false});

    onSelect = async (F) => {
        await this.props.createFilterComponent(F)
    };

    render() {
        const { open } = this.state;

        let table_body = this.state.filterMethods.map((cls, i) => {
            return (<tr key={i}>
                <td>
                    {cls.name}
                </td>
                <td>
                    {cls.description}
                </td>
                <td>
                    <Button secondary size="small" onClick={() => { this.onSelect(cls); this.close()} }>Select</Button>
                </td>
            </tr>)
        });

        return (
            <Modal
                trigger={<Button>Add filter</Button>}
                open={open}
                onOpen={this.open}
                onClose={this.close}
            >
                <Modal.Header>Select a Filter</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <table className="ui celled table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th> </th>
                            </tr>
                            </thead>
                            <tbody>
                                {table_body}
                            </tbody>
                        </table>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close}>
                        Exit <Icon name='right chevron'/>
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}