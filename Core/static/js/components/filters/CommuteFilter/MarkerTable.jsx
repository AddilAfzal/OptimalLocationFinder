import React, {Component} from "react";
import {Button, Select} from "semantic-ui-react";

const time_options = [
    {key: 15, value: 15, text: "15 Min"},
    {key: 30, value: 30, text: "30 Min"},
    {key: 45, value: 45, text: "45 Min"},
    {key: 60, value: 60, text: "60 Min"},
]

export default class MarkerTable extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {markers, edit, updateMarker} = this.props;
        console.log(markers)
        const rows = markers.map((m, i) =>
            <tr key={m.props.href}>
                <td>{i+1}</td>
                <td>{m.props.text}</td>
                <td>{m.props.position}</td>
                <td>
                    <Button.Group>
                        <Button compact disabled={!edit} active ><i className="fas fa-subway"/></Button>
                        <Button compact disabled={!edit}><i className="fas fa-bus"/></Button>
                        <Button compact disabled={!edit}><i className="fas fa-walking"/></Button>
                    </Button.Group>
                </td>
                <td>{ edit ?
                    <Select upward placeholder='Select your country' options={time_options}
                            value={m.props.time}
                            onChange={(e, v) => updateMarker(m.key, {...m.props, time: v.value} )}/> :
                    `${m.props.time} Minutes`}
                </td>
                {edit && <td><Button>Remove</Button></td>}
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
                    {edit && <th> </th>}
                </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}