import Deferred from 'es6-deferred';

import { REDUX_PREFIX } from '~/helpers/constants';

export const actions = {
  CREATE_DEFAULT_SESSION: `${REDUX_PREFIX} create default session`,
  UPDATE_SESSION: `${REDUX_PREFIX} update session`,
};

export const createDefaultSession = () => ({
  type: actions.CREATE_DEFAULT_SESSION,
});

export const updateSession = payload => ({
  type: actions.UPDATE_SESSION,
  payload,
});

// signing modal

let signingDeferred;

export function showTxSigningModal(payload) {
  return (dispatch) => {
    if (signingDeferred && signingDeferred.pending) {
      return new Error('Already Signing a Transaction');
    }
    dispatch({ type: actions.UPDATE_SESSION, payload: { signingModalData: payload } });
    signingDeferred = new Deferred();
    signingDeferred.pending = true;
    return signingDeferred;
  };
}

export function hideTxSigningModal(payload) {
  // TODO, unlock the account with the specific keystore
  return (dispatch) => {
    // or reject it...
    dispatch({ type: actions.UPDATE_SESSION, payload: { signingModalData: undefined } });
    if (!signingDeferred) signingDeferred = new Deferred();
    signingDeferred.pending = false;
    if (payload.error) {
      return signingDeferred.reject(payload.error);
    }
    return signingDeferred.resolve(payload);
  };
}

// signing Message modal

let signingMsgDeferred;

export function showMsgSigningModal(payload) {

  return (dispatch) => {
    if (signingMsgDeferred && signingMsgDeferred.pending) {
      // return new Error('Already Signing a Transaction');
      return signingMsgDeferred;
    }
    dispatch({ type: actions.UPDATE_SESSION, payload: { signingMsgModalData: payload } });
    signingMsgDeferred = new Deferred();
    signingMsgDeferred.pending = true;
    return signingMsgDeferred;
  };
}

export function hideMsgSigningModal(payload) {
  // TODO, unlock the account with the specific keystore
  return (dispatch) => {
    // or reject it...
    dispatch({ type: actions.UPDATE_SESSION, payload: { signingMsgModalData: undefined } });
    // if (!signingMsgDeferred) signingMsgDeferred = new Deferred();
    signingMsgDeferred.pending = false;
    if (payload.error) {
      return signingMsgDeferred.reject(payload.error);
    }
    return signingMsgDeferred.resolve(payload);
  };
}
