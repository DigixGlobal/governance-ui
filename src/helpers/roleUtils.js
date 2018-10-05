export const userRoles = [
  // eslint-disable-line
  {
    role: 1,
    name: 'root',
    canAccessGroups: true,
    canAccessUsers: true,
    canAccessProducts: true,
    viewableStates: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    role: 2,
    name: 'vendor',
    viewableStates: [2, 5, 6, 7, 9, 10, 11],
    canFulFillOrder: {
      state: 2,
      value: true,
    },
    canFulFillReplacementOrder: {
      state: 7,
      value: true,
    },
  },
  {
    role: 3,
    name: 'xferauth',
    viewableStates: [3, 5, 6, 10],
    canFulFillOrder: {
      state: 3,
      value: true,
    },
  },
  {
    role: 4,
    name: 'popadmin',
    canAddNewOrder: true,
    canAddNewTransferOrder: true,
    canAddNewReplacementOrder: true,
    viewableStates: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    canAppendNewDocuments: {
      state: 5,
      value: true,
    },
    canRedeem: {
      state: 9,
      value: true,
    },
    canReplaceOrder: {
      state: 6,
      value: true,
    },
    canAdminFail: {
      states: [2, 3, 4, 7, 8],
      value: true,
    },
    canRemint: {
      state: 9,
      value: true,
    },
  },
  {
    role: 5,
    name: 'custodian',
    viewableStates: [4, 5, 6, 8, 9, 10, 11],
    canAcceptDelivery: {
      state: 4,
      value: true,
    },
    canAcceptReplacementDelivery: {
      state: 8,
      value: true,
    },
  },
  {
    role: 6,
    name: 'auditor',
    viewableStates: [5, 6, 9, 10, 11],
    canAudit: {
      state: 5,
      value: true,
    },
    canAddGlobalAudit: {
      state: 5,
      value: true,
    },
  },
  {
    role: 7,
    name: 'mpadmin',
    viewableStates: [5, 6, 9, 10, 11],
  },
  {
    role: 8,
    name: 'kycadmin',
    viewableStates: [5, 6, 9, 10, 11],
  },
  {
    role: 9,
    name: 'feesadmin',
    viewableStates: [5, 6, 9, 10, 11],
  },
  {
    role: 10,
    name: 'digix uploader',
    viewableStates: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    canUploadVendorOrder: {
      states: [2, 3],
      value: true,
    },
    canUploadReplacementOrder: {
      state: 7,
      value: true,
    },
    canUploadAcceptDeliveryOrder: {
      state: 4,
      value: true,
    },
    canUploadAcceptReplacementDeliveryOrder: {
      state: 8,
      value: true,
    },
    canUploadRedeemOrder: {
      state: 9,
      value: true,
    },
    canUploadRemintOrder: {
      state: 9,
      value: true,
    },
    canUploadReplaceOrder: {
      state: 6,
      value: true,
    },
    canUploadAppendDocument: {
      state: 5,
      value: true,
    },
    canUploadAdminFail: {
      states: [2, 3, 4, 7, 8],
      value: true,
    },
  },
];

export function getRoleName(role) {
  const detail = userRoles.find(r => r.role === Number(role));
  return detail;
}
