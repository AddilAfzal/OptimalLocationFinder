import React, {Component, Fragment} from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react'

export default class Footer extends Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        return (
            <Segment inverted vertical style={{margin: '5em 0em 0em', padding: '2em 0em'}}>
                <Container textAlign='center'>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            {/*<Grid.Column width={3}>*/}
                                {/*<Header inverted as='h4' content='Group 1'/>*/}
                                {/*<List link inverted>*/}
                                    {/*<List.Item as='a'>Link One</List.Item>*/}
                                    {/*<List.Item as='a'>Link Two</List.Item>*/}
                                    {/*<List.Item as='a'>Link Three</List.Item>*/}
                                    {/*<List.Item as='a'>Link Four</List.Item>*/}
                                {/*</List>*/}
                            {/*</Grid.Column>*/}
                            {/*<Grid.Column width={3}>*/}
                                {/*<Header inverted as='h4' content='Group 2'/>*/}
                                {/*<List link inverted>*/}
                                    {/*<List.Item as='a'>Link One</List.Item>*/}
                                    {/*<List.Item as='a'>Link Two</List.Item>*/}
                                    {/*<List.Item as='a'>Link Three</List.Item>*/}
                                    {/*<List.Item as='a'>Link Four</List.Item>*/}
                                {/*</List>*/}
                            {/*</Grid.Column>*/}
                            {/*<Grid.Column width={3}>*/}
                                {/*<Header inverted as='h4' content='Group 3'/>*/}
                                {/*<List link inverted>*/}
                                    {/*<List.Item as='a'>Link One</List.Item>*/}
                                    {/*<List.Item as='a'>Link Two</List.Item>*/}
                                    {/*<List.Item as='a'>Link Three</List.Item>*/}
                                    {/*<List.Item as='a'>Link Four</List.Item>*/}
                                {/*</List>*/}
                            {/*</Grid.Column>*/}
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Information'/>
                                <p>
                                    This system was designed by Addil Afzal as part of their final year project.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    {/*<Divider inverted section/>*/}
                    {/*<List horizontal inverted divided link>*/}
                        {/*<List.Item as='a' href='#'>*/}
                            {/*Site Map*/}
                        {/*</List.Item>*/}
                        {/*<List.Item as='a' href='#'>*/}
                            {/*Contact Us*/}
                        {/*</List.Item>*/}
                        {/*<List.Item as='a' href='#'>*/}
                            {/*Terms and Conditions*/}
                        {/*</List.Item>*/}
                        {/*<List.Item as='a' href='#'>*/}
                            {/*Privacy Policy*/}
                        {/*</List.Item>*/}
                    {/*</List>*/}
                </Container>
            </Segment>
        )
    }
}