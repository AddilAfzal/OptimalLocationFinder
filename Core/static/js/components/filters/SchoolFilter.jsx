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
            gender: "M",
            selective: 'any',
        }
    }

    componentDidMount() {
        super.componentDidMount();

        if(this.props.data.school && this.props.data.school.school) {
            const school = this.props.data.school.school;

            this.setState({
                ...this.state,
                ...school
            });

            this.save();
        }
    }

    static filter_name = "School filter";
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
        const {is_primary, is_secondary, is_post16, gender, selective} = this.state;

        return {
            'school': {
                'school': {
                    is_primary,
                    is_post16,
                    is_secondary,
                    gender,
                    selective,
                }

            }
        };
    };

    handleChangeAdmissionType = (_, {value}) => this.setState({selective: value});

    renderBody() {
        const {is_primary, is_secondary, is_post16, gender, selective} = this.state;

        return (
            <Fragment>
                <h3>School</h3>
                <Header style={{marginTop: 0}} size='small'>What type of school are you looking for?</Header>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Primary </label>}
                                checked={is_primary}
                                onChange={() => this.setState({is_primary: !is_primary})}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Secondary </label>}
                                checked={is_secondary}
                                onChange={() => this.setState({is_secondary: !is_secondary})}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Post 16 </label>}
                                checked={is_post16}
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
                                    value='M'
                                    checked={gender === 'M'}
                                    onChange={() => this.setState({gender: 'M'})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Specific'
                                    name='checkboxRadioGroup'
                                    value='that'
                                    onChange={() => this.setState({gender: null})}
                                    checked={gender === 'B' | gender === 'G' | gender === null}
                                    // onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>

                    {(gender === null | gender === 'B' | gender === 'G') ?
                    <Grid.Column width={6}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={4}>
                                    <Checkbox
                                        checked={gender === 'B'}
                                        label={<label>Boys </label>}
                                        onChange={() => this.setState({gender: 'B'})}
                                    />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Checkbox
                                        checked={gender === 'G'}
                                        label={<label>Girls</label>}
                                        onChange={() => this.setState({gender: 'G'})}
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
                            checked={selective === 'any'}
                            onChange={this.handleChangeAdmissionType}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Non-selective'
                            name='checkboxRadioGroup'
                            value={false}
                            checked={selective === false}
                            onChange={this.handleChangeAdmissionType}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Selective'
                            name='checkboxRadioGroup'
                            value={true}
                            checked={selective === true}
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