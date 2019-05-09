import React, {Component} from "react";
import {
  Container,
  Grid,
  Header,
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

                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Information'/>
                                <p>
                                    This system was designed by Addil Afzal as part of their final year project.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Container>
            </Segment>
        )
    }
}