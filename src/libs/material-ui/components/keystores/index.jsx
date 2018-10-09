import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { CardContent, CardHeader } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';

import { createKeystore, updateKeystore, deleteKeystore } from '~/actions/keystore';
import { updateSession } from '~/actions/session';
import { getKeystores } from '~/selectors';
import { getV3FileName } from '~/helpers/stringUtils';

// import CustomTabs from '../../ui-wrapper/CustomTabs/CustomTabs';
// import Tasks from '../../ui-wrapper/Tasks/Tasks';

import KeystoreModal from './keystore_modal';
import KeystoreEditForm from './keystore_edit_form';
import Address from './address';
import KeystoreButtons from './keystore_buttons';

const styles = {
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    marginTop: 50,
  },
};

class Keystores extends Component {
  constructor(props) {
    super(props);
    this.state = { newStore: undefined, downloaded: false };
    this.handleChange = this.handleChange.bind(this);
    // this.downloadKeystore = this.downloadKeystore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.keystores, this.props.keystores)) {
      const { keystores } = nextProps;
      if (keystores) {
        // const addresses = [];
        const addresses = keystores.map(keystore => keystore).reduce((key, keystore) => {
          keystore.addresses.map(addr => key.push(addr));
          return key;
          // return addresses;
        }, []);

        let defaultAddress;
        try {
          defaultAddress = addresses.find(address => address.isDefault);
          // if (oldStores.length > 0 && defaultAddress.type.id === 'v3') newStore = defaultAddress;
          if (defaultAddress === undefined) {
            // console.log(addresses[0].address);
            this.props.updateSession({ defaultAddress: addresses[0].address });
          }
        } catch (e) {
          // do nothing
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextState, this.state) || !_.isEqual(nextProps, this.props);
  }

  downloadKeystore(keystore) {
    return new Promise((resolve) => {
      const { data, addresses } = keystore;
      const parsed = JSON.parse(data);
      const { address } = parsed;
      // update the name
      const content = JSON.stringify({ ...parsed, name: addresses[0].name });
      const name = getV3FileName(address);
      resolve({ name, content });
    });
  }

  handleChange({ address }) {
    this.props.updateSession({ defaultAddress: address });
  }
  renderKeystores() {
    return this.props.keystores.map(keystore => (
      <Card>
        <CardHeader
          title={keystore.type.name}
          subheader={keystore.type.name}
          action={
            <KeystoreModal
              {...this.props}
              header={`Edit Keystore: ${keystore.type.name}`}
              submitFunc={this.props.updateKeystore}
              removeFunc={this.props.deleteKeystore}
              data={keystore}
              form={KeystoreEditForm}
              trigger={
                <Button>
                  <SettingsIcon /> Account Settings
                </Button>
              }
            />
          }
        />
        <CardContent>
          <Table basic="very">
            <Table.Body>
              {keystore.addresses.map(address => (
                <Address
                  onChange={() => this.handleChange(address)}
                  {...this.props}
                  key={address.address}
                  keystore={keystore}
                  address={address}
                  disabled={this.props.keystores.length === 1}
                />
              ))}
            </Table.Body>
          </Table>
        </CardContent>
      </Card>
    ));
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center" spacing={24} className={classes.container}>
        <Grid item sm={12} md={8} lg={10} xl={10}>
          <Card>
            <CardHeader
              title="Wallet"
              subheader="Manage your Accounts"
              classes={{ action: classes.headerActions }}
              action={<KeystoreButtons {...this.props} />}
            />
            <CardContent>
              {!this.props.keystores || this.props.keystores.length === 0 ? (
                <Typography variant="body2" color="error">
                  No Keystores Created. Please create or Import a Keystore
                </Typography>
              ) : (
                this.renderKeystores()
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  keystores: getKeystores(state),
});

const actions = {
  createKeystore,
  updateKeystore,
  deleteKeystore,
  updateSession,
};

Keystores.propTypes = {
  keystores: PropTypes.array.isRequired,
  updateKeystore: PropTypes.func.isRequired,
  deleteKeystore: PropTypes.func.isRequired,
  updateSession: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  actions,
)(withStyles(styles)(Keystores));
