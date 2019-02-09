import React, {Component} from "react";
import {Button} from "semantic-ui-react";


export default class MarkerTable extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {markers} = this.props;
        console.log(markers)
        const rows = markers.map((m, i) =>
            <tr key={m.props.href}>
                <td>{i+1}</td>
                <td>{m.props.text}</td>
                <td>{m.props.position}</td>
                <td>
                    <Button.Group>
                        <Button compact><i className="fas fa-subway"/></Button>
                        <Button compact><i className="fas fa-bus"/></Button>
                        <Button compact><i className="fas fa-walking"/></Button>
                    </Button.Group>
                </td>
                <td>Time</td>
                <td><Button>Remove</Button></td>
            </tr>);

        return (
            rows.length > 0 && <table className="ui celled table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Label</th>
                    <th>Position</th>
                    <th>Mode of transport</th>
                    <th>Max commute time</th>
                    <th> </th>
                </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}