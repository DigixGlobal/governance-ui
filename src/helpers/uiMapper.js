import materialize from '../libs/material-ui/components/app';
// import semantic from '../libs/semantic-ui/components/app';

const knownUi = [
  // {
  //   name: 'semantic-ui',
  //   component: semantic,
  // },
  {
    name: 'material-ui',
    component: materialize,
  },
];
export default (ui) => {
  if (!ui) throw new Error('UI Library to use not set, please specify');
  const lib = knownUi.find(uiLib => uiLib.name === ui.name);

  return lib;
};
