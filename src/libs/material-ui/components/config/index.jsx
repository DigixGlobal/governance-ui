import React, { Component } from 'react';
import { Grid, Container } from 'semantic-ui-react';

import Networks from './networks';
import Tokens from './tokens';

export default class Config extends Component {
  render() {
    return (
      <Container className="grid-container">
        <Grid>
          <Grid.Column largeScreen={8} computer={16}>
            <Networks />
          </Grid.Column>
          <Grid.Column largeScreen={8} computer={16}>
            <Tokens />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
