import { defineSupportCode } from 'cucumber';

import clearInputField from '../support/action/clearInputField';
import clickElement from '../support/action/clickElement';
import closeLastOpenedWindow from '../support/action/closeLastOpenedWindow';
import deleteCookie from '../support/action/deleteCookie';
import dragElement from '../support/action/dragElement';
import focusLastOpenedWindow from '../support/action/focusLastOpenedWindow';
import handleModal from '../support/action/handleModal';
import moveToElement from '../support/action/moveToElement';
import pause from '../support/action/pause';
import pressButton from '../support/action/pressButton';
import scroll from '../support/action/scroll';
import selectOption from '../support/action/selectOption';
import selectOptionByIndex from '../support/action/selectOptionByIndex';
import setCookie from '../support/action/setCookie';
import setInputField from '../support/action/setInputField';
import setPromptText from '../support/action/setPromptText';
import submitForm from '../support/action/submitForm';

// custom
import importKeystore from '../support/action/importKeystore';
import importKeystoreInWallet from '../support/action/importKeystoreInWallet';
import refresh from '../support/action/refresh';
import recastAsset from '../support/action/recastAsset';
import remintAsset from '../support/action/remintAsset';
import signTransaction from '../support/action/signTransaction';
import uploaderSignTransaction from '../support/action/uploaderSignTransaction';
import verifyOrder from '../support/action/verifyOrder';
import inputVendorOrder from '../support/action/inputVendorOrder';
import inputCustodianDeliveryOrder from '../support/action/inputCustodianDeliveryOrder';
import setFileField from '../support/action/setFileField';

defineSupportCode(({ When }) => {
  // custom
  When(/^I import keystore "([^"]*)?" on the filefield "([^"]*)?"$/, importKeystore);
  When(/^I import keystore "([^"]*)?" with a password "([^"]*)?" in wallet$/, importKeystoreInWallet);
  When(/^I sign transaction$/, signTransaction);
  When(/^I upload and sign transaction$/, uploaderSignTransaction);
  When(/^I refresh the page$/, refresh);
  When(/^I recast (asset|assets)$/, recastAsset);
  When(/^I remint (asset|assets)$/, remintAsset);
  When(/^I enter job id and verify the order$/, verifyOrder);
  When(/^I input information for vendor order #(\d+)$/, inputVendorOrder);
  When(/^I input information for custodian delivery order #(\d+)$/, inputCustodianDeliveryOrder);
  When(/^I set file "([^"]*)?" from "([^"]*)?" into "([^"]*)?"$/, setFileField);

  When(/^I (click|doubleclick) on the (link|button|element) "([^"]*)?"$/, clickElement);

  When(/^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/, setInputField);

  When(/^I clear the inputfield "([^"]*)?"$/, clearInputField);

  When(/^I drag element "([^"]*)?" to element "([^"]*)?"$/, dragElement);

  When(/^I submit the form "([^"]*)?"$/, submitForm);

  When(/^I pause for (\d+)ms$/, pause);

  When(/^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/, setCookie);

  When(/^I delete the cookie "([^"]*)?"$/, deleteCookie);

  When(/^I press "([^"]*)?"$/, pressButton);

  When(/^I (accept|dismiss) the (alertbox|confirmbox|prompt)$/, handleModal);

  When(/^I enter "([^"]*)?" into the prompt$/, setPromptText);

  When(/^I scroll to element "([^"]*)?"$/, scroll);

  When(/^I close the last opened (window|tab)$/, closeLastOpenedWindow);

  When(/^I focus the last opened (window|tab)$/, focusLastOpenedWindow);

  When(/^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/, selectOptionByIndex);

  When(/^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/, selectOption);

  When(/^I move to element "([^"]*)?"(?: with an offset of (\d+),(\d+))*$/, moveToElement);
});
