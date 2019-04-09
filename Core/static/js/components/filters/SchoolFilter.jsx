import React, {Component, Fragment} from "react";
import {
    Header, Form, List, Checkbox, Grid, Divider
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
        const {is_primary, is_secondary, is_post16} = this.state;

        return this.renderBody()
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
        const {is_primary, is_secondary, is_post16, gender, selective, collapse} = this.state;

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
                                disabled={collapse}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Secondary </label>}
                                checked={is_secondary}
                                onChange={() => this.setState({is_secondary: !is_secondary})}
                                disabled={collapse}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Checkbox
                                label={<label>Post 16 </label>}
                                checked={is_post16}
                                onChange={() => this.setState({is_post16: !is_post16})}
                                disabled={collapse}
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
                                    disabled={collapse}
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
                                    disabled={collapse}
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
                                        disabled={collapse}
                                    />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Checkbox
                                        checked={gender === 'G'}
                                        label={<label>Girls</label>}
                                        onChange={() => this.setState({gender: 'G'})}
                                        disabled={collapse}
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
                            disabled={collapse}
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
                            disabled={collapse}
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
                            disabled={collapse}
                        />
                    </Form.Field>
                </Form>
            </Fragment>
        )
    }

    isValid = () => {
        const {is_primary, is_secondary, is_post16} = this.state;
        return is_post16 | is_secondary | is_primary;
    };
}