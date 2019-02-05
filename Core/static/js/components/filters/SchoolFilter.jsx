import React, {Component, Fragment} from "react";
import {
    Button, Header, Form, Dropdown, List, Checkbox, Grid, Divider
} from 'semantic-ui-react'

import {Segment} from 'semantic-ui-react'
import BaseFilter from "./BaseFilter";


export default class SchoolFilter extends BaseFilter {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            is_primary: false,
            is_secondary: false,
            is_post16: false,
            gender: "mixed",
            admissionType: 'any',
        }
    }

    componentDidMount() {
        super.componentDidMount();

    }

    static description = "Distance from nearest school meeting specific requirements.";

    getCollapsedText = () => {
        // let {propertyTypes} = this.state;
        return (
            <Fragment>
                <h3>School</h3>
            </Fragment>
        )
    };

    getData = () => {
        return {'school': {}};
    };

    handleChangeAdmissionType = (_, {value}) => this.setState({admissionType: value});

    renderBody() {
        const {is_primary, is_secondary, is_post16, gender, admissionType} = this.state;

        return (
            <Fragment>
                <h3>School</h3>
                <Header style={{marginTop: 0}} size='small'>What type of school are you looking for?</Header>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Primary </label>}
                                onChange={() => this.setState({is_primary: !is_primary})}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Secondary </label>}
                                onChange={() => this.setState({is_secondary: !is_secondary})}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Post 16 </label>}
                                onChange={() => this.setState({is_post16: !is_post16})}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider/>
                <Header style={{marginTop: 0}} size='small'>Gender</Header>
                <Grid>
                    <Grid.Column width={6}>
                        <Form>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Mixed'
                                    name='checkboxRadioGroup'
                                    value='mixed'
                                    checked={gender === 'mixed'}
                                    onChange={() => this.setState({gender: 'mixed'})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Specific'
                                    name='checkboxRadioGroup'
                                    value='that'
                                    onChange={() => this.setState({gender: null})}
                                    checked={gender === 'boys' | gender === 'girls' | gender === null}
                                    // onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>

                    {(gender === null | gender === 'boys' | gender === 'girls') ?
                    <Grid.Column width={6}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={4}>
                                    <Checkbox
                                        checked={gender === 'boys'}
                                        label={<label>Boys </label>}
                                    />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Checkbox
                                        checked={gender === 'girls'}
                                        label={<label>Girls </label>}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column> : ''}

                </Grid>
                <Divider/>
                <Header style={{marginTop: 0}} size='small'>Admission type</Header>
                <Form>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Any'
                            name='checkboxRadioGroup'
                            value='any'
                            checked={admissionType === 'any'}
                            // onChange={() => this.setState({admissionType: 'any'})}
                            onChange={this.handleChangeAdmissionType}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Non-selective'
                            name='checkboxRadioGroup'
                            value='non-selective'
                            checked={admissionType === 'non-selective'}
                            onChange={this.handleChangeAdmissionType}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Selective'
                            name='checkboxRadioGroup'
                            value='selective'
                            checked={admissionType === 'selective'}
                            onChange={this.handleChangeAdmissionType}
                        />
                    </Form.Field>
                </Form>
            </Fragment>
        )
    }

    isValid = () => {
        return true;
    };
}