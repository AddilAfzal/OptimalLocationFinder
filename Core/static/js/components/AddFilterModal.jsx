import React, {Component} from "react";
import {
    Button, Modal
} from 'semantic-ui-react'

import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";
import CommuteFilter from "./filters/CommuteFilter";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import SchoolFilter from "./filters/SchoolFilter";


export default class AddFilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterMethods: [
                AreaFilter,
                RoomsFilter,
                CommuteFilter,
                SchoolFilter
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
                    {cls.filter_name}
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