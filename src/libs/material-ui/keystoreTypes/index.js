import v3 from './v3';
import ledger from './ledger';
import trezor from './trezor';
import cold from './cold';
// import multisig from './multisig';
import metamask from './metamask';
import imtoken from './imtoken';

const keystores = { v3, cold, ledger, metamask, trezor, imtoken };

export function getKeystoreComponent({ type, id }) {
  return ((keystores[id] || {}).components || {})[type] || null;
}

export function getKeystoreAction({ type, id }) {
  return ((keystores[id] || {}).actions || {})[type] || null;
}
