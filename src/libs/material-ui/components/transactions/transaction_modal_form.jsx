import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'react-semantic-ui-range';
import FormField from '~/libs/material-ui/components/common/form_field';
import Advanced from '~/libs/material-ui/components/common/advanced';
import { Form, Message, Segment, Grid, Popup } from 'semantic-ui-react';

import Web3Connect from '~/helpers/web3/connect';

class TransactionModalForm extends Component {
  static propTypes = {
    formChange: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    form: PropTypes.func,
    disableAdvanced: PropTypes.bool,
    renderForm: PropTypes.func,
  };
  static defaultProps = {
    form: undefined,
    renderForm: undefined,
    disableAdvanced: false,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      disableAdvanced,
      renderForm,
      form: FormComponent,
      formChange,
      formData: { gasStation = {} },
      formData,
    } = this.props;
    const { safeLow = 1, average = 20, fastest = 100 } = gasStation;

    return (
      <div>
        {(renderForm && renderForm(this.props)) || (FormComponent && <FormComponent {...this.props} />)}

        <Form.Group inline>
          <label htmlFor="gasPrice">Transaction Speed (Gas Price in Gwei)</label>
          <Popup
            trigger={<Form.Input width={2} disabled value={this.state.value || average} />}
            content="Use the slider below to change this value"
            hideOnScroll
          />
        </Form.Group>
        <Form.Field>
          <Grid columns="equal">
            <Grid.Column>
              <Segment>
                <Slider
                  color="blue"
                  inverted={false}
                  settings={{
                    start: average,
                    min: safeLow,
                    max: fastest,
                    step: 1,
                    onChange: (value) => {
                      this.props.setFormData({ ...formData, gasPrice: value * 1e9 });
                      this.setState({
                        value,
                      });
                    },
                  }}
                />
              </Segment>
            </Grid.Column>
          </Grid>
        </Form.Field>
        {!disableAdvanced && (
          <Advanced>
            <Message
              icon="attention"
              color="red"
              header="Warning!"
              content="These are the recommended settings. Change at your own risk!"
            />
            <Form.Group widths="equal">
              <FormField type="number" placeholder="e.g. `21000`" label="Gas Limit" name="gas" {...{ formChange, formData }} />
              <FormField
                type="number"
                placeholder="Leave empty to auto-detect"
                label="Nonce"
                name="nonce"
                {...{ formChange, formData }}
              />
            </Form.Group>
          </Advanced>
        )}
      </div>
    );
  }
}

export default Web3Connect(TransactionModalForm);
