Feature:
  In order to easily test the provenance app
  As a user or developer
  I want to make sure that the app is working properly

  Scenario: Check title of website after accepting terms and conditions
    Given I open Provenance and agree to the terms
    Then I expect that the title is "Digix Proof of Provenance"

  Scenario: Check Information page
    Given I open the url "https://localhost:3000/#/provenance"
    When I click on the link "Information"
    Then I expect that element ".header=Information about configuration and fees collected in all DGX transactions" becomes visible

  Scenario: Check Audit Documents List page
    Given I open the url "https://localhost:3000/#/provenance"
    When I click on the link "Audit Documents List"
    Then I expect that element ".content=Audit Document List" becomes visible

  Scenario: Check Asset List page without adding a wallet
    Given I open the url "https://localhost:3000/#/provenance"
    When I click on the link "Asset List"
    Then I expect that element ".content=Minted - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "span*=Minted"
    And I expect that element "div*=Audit Failure" becomes visible
    And I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[2]"
    Then I expect that element ".content=Audit Failure - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "span*=Audit Failure"
    And I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[3]"
    Then I expect that element ".content=Admin Failure - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "span*=Admin Failure"
    And I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[4]"
    Then I expect that element ".content=Recasted - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "span*=Recasted"
    And I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]"
    Then I expect that element ".content=Redeemed - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible

  Scenario: Check root user visible pages
    Given I import keystore "root.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "a=Groups" becomes visible
    And I expect that element "a=Users" becomes visible
    And I expect that element "a=Products" becomes visible

  Scenario: Add new product
    When I click on the link "Products"
    Then I expect that element ".header*=Product List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button.huge.circular"
    Then I expect that element ".header=Product Info" becomes visible
    When I set "1000" to the inputfield "[name='weight']"
    And I set "1000" to the inputfield "[name='effectiveWeight']"
    And I set "Test Product" to the inputfield "[name='productName']"
    And I set "Test Manufacturer" to the inputfield "[name='manufacturer']"
    And I set "Test description" to the inputfield "[name='description']"
    When I click on the element "button=Save Product"
    And I sign transaction

  Scenario: Add new user
    When I click on the link "Users"
    Then I expect that element ".header*=User List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button.huge.circular"
    Then I expect that element ".header=Add User" becomes visible
    When I set "0xe7056b928b4aD4c6A02cA6d62C0c8a5Af5Bf2836" to the inputfield "[name='userAddress']"
    And I set "valuemax" to the inputfield "[class='search']"
    And I set "Test User" to the inputfield "[name='name']"
    When I click on the element "button=Add"
    And I sign transaction

  Scenario: Remove user
    When I click on the link "Users"
    Then I expect that element ".header*=User List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".remove.circle"
    Then I expect that element ".header=Delete User" becomes visible
    And I expect that element "strong" matches the text "0xe7056b928b4ad4c6a02ca6d62c0c8a5af5bf2836"
    When I click on the element "button=OK"
    And I sign transaction

  Scenario:  Add new group
    When I click on the link "Groups"
    Then I expect that element ".header*=Group List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button.huge.circular"
    Then I expect that element ".header=Add Group" becomes visible
    When I set "Test Group" to the inputfield "[name='group']"
    And I set "Test Name" to the inputfield "[name='name']"
    And I set "Test ID" to the inputfield "[name='corporateId']"
    And I set "Test description" to the inputfield "[name='descriptionText']"
    And I set "test.com" to the inputfield "[name='url']"
    And I set "Singapore" to the inputfield "[class='search']"
    And I click on the element ".selection.dropdown"
    And I click on the element "span=vendor"
    When I click on the element "button=Save Group"
    And I sign transaction

  Scenario: Check recaster user visible pages
    Given I import keystore "recaster.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "a=Your Recasts List" becomes visible
    And I expect that element "a=Information" becomes visible
    And I expect that element "a=Audit Documents List" becomes visible
    And I expect that element "a=Asset List" becomes visible

  Scenario: Recast assets
    Then I expect that element ".content=Minted - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I recast assets
    And I sign transaction

  Scenario: Remint an asset
    When I click on the link "Your Recasts List"
    Then I expect that element ".content=Your Recast List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I remint asset
    And I sign transaction

  Scenario: Check uploader user visible pages
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "a=Unsynced Global Audit List" becomes visible
    And I expect that element "a=Information" becomes visible
    And I expect that element "a=Audit Documents List" becomes visible
    And I expect that element "a=Asset List" becomes visible

  Scenario: Uploader creates an order
    Given I open the url "https://localhost:3000/#/provenance"
    Then I expect that element "button=Order" becomes visible
    When I click on the element "button=Order"
    Then I expect that element ".header=Create Order" becomes visible
    And I set "1" to the inputfield "[name='orderCount']"
    Then I expect that element ".header=Order #1" becomes visible
    And I click on the element ".selection.dropdown"
    Then I expect that element "span.text*=Gold Valcambi" becomes visible
    And I click on the element "span.text*=Gold Valcambi"
    When I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: PoP Admin signs the order job id
    Given I import keystore "popadmin.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "button=Sign Order" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Sign Order"
    Then I expect that element ".header=Sign Order" becomes visible
    When I enter job id and verify the order
    Then I expect that element "button=Save Order" becomes visible
    And I click on the element "button=Save Order"
    And I sign transaction

  Scenario: Uploader creates a vendor order
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Create Vendor Order"
    Then I expect that element ".header=Create Vendor Order" becomes visible
    When I input information for vendor order #1
    And I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: Vendor signs the fulfill order job id
    Given I import keystore "vendor.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "button=Fulfill Order" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Fulfill Order"
    Then I expect that element ".header=Fulfill Order" becomes visible
    When I enter job id and verify the order
    Then I expect that element "/html/body/div[4]/div/div[3]/div/button[2]" becomes visible
    And I click on the element "/html/body/div[4]/div/div[3]/div/button[2]"
    And I sign transaction

  Scenario: Uploader creates a custodian delivery order
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[3]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[3]"
    Then I expect that element ".content=Custodian Delivery - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Create Custodian Delivery"
    Then I expect that element ".header=Create Custodian Delivery" becomes visible
    When I input information for custodian delivery order #1
    And I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: Custodian signs the custodian delivery order job id
    Given I import keystore "custodian.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "button=Accept Delivery" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Accept Delivery"
    Then I expect that element ".header=Sign Accept Delivery" becomes visible
    When I enter job id and verify the order
    Then I expect that element "/html/body/div[4]/div/div[3]/div/button[2]" becomes visible
    And I click on the element "/html/body/div[4]/div/div[3]/div/button[2]"
    And I sign transaction

  Scenario: Uploader creates a global audit document with failing asset
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[4]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[4]"
    Then I expect that element ".content=Minted - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Upload Global Audit Document"
    Then I expect that element ".header=Upload Global Audit Document" becomes visible
    When I set file "global_audit.png" from "images" into "[type=file]"
    Then I expect that element "button=Save" becomes visible
    And I click on the element "button=Save"
    And I upload and sign transaction

  Scenario: Auditor signs the global audit document job id with failing asset
    Given I import keystore "auditor.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "button=Sign Global Audit Documents" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Sign Global Audit Documents"
    Then I expect that element ".header=Sign Global Audit Documents" becomes visible
    When I enter job id and verify the order
    Then I expect that element "button=Sign documents" becomes visible
    And I click on the element "button=Sign documents"
    And I sign transaction

  Scenario: Uploader creates a global audit document without failing asset
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[4]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[4]"
    Then I expect that element ".content=Minted - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Upload Global Audit Document"
    Then I expect that element ".header=Upload Global Audit Document" becomes visible
    When I set file "global_audit.png" from "images" into "[type=file]"
    Then I expect that element "button=Save" becomes visible
    And I click on the element "button=Save"
    And I upload and sign transaction

  Scenario: Auditor signs the global audit document job id without failing asset
    Given I import keystore "auditor.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "button=Sign Global Audit Documents" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Sign Global Audit Documents"
    Then I expect that element ".header=Sign Global Audit Documents" becomes visible
    When I enter job id and verify the order
    Then I expect that element "button=Sign documents" becomes visible
    And I click on the element "button=Sign documents"
    And I sign transaction

  Scenario: Uploader creates an audit failure
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "a*=Unsynced Global Audit List" becomes visible
    And I click on the link "Unsynced Global Audit List"
    And I expect that element "div.text.loader" becomes not visible
    Then I expect that element ".content*=Unsynced Global Audit List" becomes visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Create Audit Failure"
    Then I expect that element ".header=Create Audit Failure" becomes visible
    When I click on the element ".selection.dropdown"
    Then I expect that element "span*=DUX test failure" becomes visible
    And I click on the element "span*=DUX test failure"
    When I set file "audit_failure.png" from "images" into "[type=file]"
    Then I expect that element "button=Save Audit" becomes visible
    And I click on the element "button=Save Audit"
    And I upload and sign transaction

  Scenario: Auditor signs the audit failure job id
    Given I import keystore "auditor.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element "a*=Unsynced Global Audit List" becomes visible
    And I click on the link "Unsynced Global Audit List"
    And I expect that element "div.text.loader" becomes not visible
    Then I expect that element "button=Sign Fail Audit" becomes visible
    When I click on the element "button=Sign Fail Audit"
    Then I expect that element ".header=Audit Failure" becomes visible
    When I enter job id and verify the order
    Then I expect that element "button=Audit" becomes visible
    And I click on the element "button=Audit"
    And I sign transaction

  Scenario: Uploader creates a replace order
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]"
    Then I expect that element ".content=Audit Failure - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Create Replace Orders"
    Then I expect that element ".header=Create Replace Orders" becomes visible
    When I click on the element ".selection.dropdown"
    Then I expect that element "/html/body/div[4]/div/div[2]/form/div/div/div[1]/div/div[2]/div/span" becomes visible
    When I click on the element "/html/body/div[4]/div/div[2]/form/div/div/div[1]/div/div[2]/div/span"
    Then I expect that element "button=Save Order" becomes visible
    And I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: PoP Admin signs the replace order job id
    Given I import keystore "popadmin.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]"
    Then I expect that element ".content=Audit Failure - Asset List" becomes visible
    And I expect that element "button=Replacement Order" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Replacement Order"
    Then I expect that element ".header=Sign Replacement Order" becomes visible
    When I enter job id and verify the order
    Then I expect that element "button=Confirm Replacement" becomes visible
    And I click on the element "button=Confirm Replacement"
    And I sign transaction

  Scenario: Uploader creates a replacement vendor order
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[7]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[7]"
    Then I expect that element ".content=Replacement Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Create Replacement Order"
    Then I expect that element ".header=Create Replacement Order" becomes visible
    When I input information for vendor order #1
    And I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: Vendor signs the fulfill replacement order job id
    Given I import keystore "vendor.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[6]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[6]"
    Then I expect that element ".content=Replacement Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    Then I expect that element "button=Fulfill Replacement Order" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Fulfill Replacement Order"
    Then I expect that element ".header=Fulfill Replacement Order" becomes visible
    When I enter job id and verify the order
    Then I expect that element "/html/body/div[4]/div/div[3]/div/button[2]" becomes visible
    And I click on the element "/html/body/div[4]/div/div[3]/div/button[2]"
    And I sign transaction

  Scenario: Uploader creates a replacement delivery order
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[8]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[8]"
    Then I expect that element ".content=Replacement Delivery - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Custodian Replacement Delivery"
    Then I expect that element ".header=Create Custodian Replacement Delivery" becomes visible
    When I input information for custodian delivery order #1
    And I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: Custodian signs the custodian replacement delivery order job id
    Given I import keystore "custodian.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Custodian Delivery - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Custodian Delivery" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Custodian Delivery"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[5]"
    Then I expect that element ".content=Replacement Delivery - Asset List" becomes visible
    Then I expect that element "button=Accept Replacement Delivery" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Accept Replacement Delivery"
    Then I expect that element ".header=Sign Accept Replacement Delivery" becomes visible
    When I enter job id and verify the order
    Then I expect that element "button=Accept Delivery" becomes visible
    And I click on the element "button=Accept Delivery"
    And I sign transaction

  Scenario: Uploader creates a redeem order
    Given I import keystore "uploader.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[9]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[9]"
    Then I expect that element ".content=Recasted - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element ".ui.checkbox"
    And I click on the element "button=Create Redeem Order"
    Then I expect that element ".header=Create Redeem Order" becomes visible
    When I set "Some document reference" to the inputfield "[name='documentReference1']"
    And I set file "image.jpg" from "images" into "[type=file]"
    And I click on the element "button=Save Order"
    And I upload and sign transaction

  Scenario: PoP Admin signs the redeem order job id
    Given I import keystore "popadmin.json" with a password "digixtest" in wallet
    When I click on the link "Assets Explorer"
    Then I expect that element ".content=Vendor Order - Asset List" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    And I expect that element "span*=Vendor Order" becomes visible
    Then I pause for 1500ms
    When I click on the element "span*=Vendor Order"
    Then I expect that element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[9]" becomes visible
    When I click on the element "//*[@id='app']/div/div/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div/div[9]"
    Then I expect that element ".content=Recasted - Asset List" becomes visible
    And I expect that element "button=Redeem Asset" becomes visible
    And I expect that element "div.text.loader" becomes not visible
    When I click on the element "button=Redeem Asset"
    Then I expect that element ".header=Sign Redeem Asset" becomes visible
    When I enter job id and verify the order
    Then I expect that element "/html/body/div[4]/div/div[3]/div/button[2]" becomes visible
    And I click on the element "/html/body/div[4]/div/div[3]/div/button[2]"
    And I sign transaction