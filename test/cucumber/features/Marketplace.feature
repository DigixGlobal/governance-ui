Feature:
  In order to easily test the marketplace app
  As a user or developer
  I want to make sure that the app is working properly

  Scenario: Check title of website after accepting terms and conditions
    Given I open Marketplace and agree to the terms
    Then I expect that the title is "Digix Marketplace"

  Scenario: Log in using correct credentials
    When I set "admin@digix.global" to the inputfield "[name='email']"
    And I set "digixglobal" to the inputfield "[name='password']"
    And I click on the element "button=Log In"
    Then I wait on element ".header*=Buy DGX Tokens" to be visible
    And I expect that the url is "https://localhost:3000/#/marketplace/dgx"

  Scenario: Log out account
    When I scroll to element "span=admin@digix.global"
    Then I click on the element "span=admin@digix.global"
    And I click on the element "span=Log Out"

  Scenario: Log in using unregistered email
    Given I open the url "https://localhost:3000/#/marketplace"
    Then I expect that element "button=Log In" becomes visible
    When I set "test@test.com" to the inputfield "[name='email']"
    And I set "test" to the inputfield "[name='password']"
    And I click on the element "button=Log In"
    Then I expect that element "p=Unconfirmed e-mail" becomes visible

  Scenario: Log in using registered email with invalid password
    When I set "admin@digix.global" to the inputfield "[name='email']"
    And I set "test" to the inputfield "[name='password']"
    And I click on the element "button=Log In"
    Then I expect that element "p=Invalid username/password" becomes visible

  Scenario: Check Forgot and Back to login links
    When I click on the link "Forgot?"
    Then I expect that the url is "https://localhost:3000/#/marketplace/reset-password"
    And I expect that element "button=Reset Password" becomes visible
    When I click on the link "Back to Login"
    Then I expect that the url is "https://localhost:3000/#/marketplace"
    And I expect that element "button=Log In" becomes visible

  Scenario: Forgot password is working
    When I click on the link "Forgot?"
    Then I expect that the url is "https://localhost:3000/#/marketplace/reset-password"
    And I expect that element "button=Reset Password" becomes visible
    When I set "admin@digix.global" to the inputfield "[name='email']"
    When I click on the element "button=Reset Password"
    Then I expect that element ".header=Password reset request received!" becomes visible

  Scenario: Forgot password using unregistered email
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Forgot?"
    Then I expect that the url is "https://localhost:3000/#/marketplace/reset-password"
    And I expect that element "button=Reset Password" becomes visible
    When I set "someEmail@gmail.com" to the inputfield "[name='email']"
    When I click on the element "button=Reset Password"
    Then I expect that element "p=Unable to find user with email 'someemail@gmail.com'." becomes visible

  Scenario: Register an account with invalid email
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Sign-Up"
    Then I expect that the url is "https://localhost:3000/#/marketplace/register"
    And I expect that element ".header=Create New Account" is visible
    Given I register invalid account in Marketplace
    And I set "testtest" to the inputfield "[name='password']"
    And I set "testtest" to the inputfield "[name='password_confirmation']"
    When I click on the element "button=Register New Account"
    Then I expect that element "p=Email is not an email" becomes visible

  Scenario: Register a new account with correct password
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Sign-Up"
    Then I expect that the url is "https://localhost:3000/#/marketplace/register"
    And I expect that element ".header=Create New Account" is visible
    Given I register new account in Marketplace
    And I set "testtest" to the inputfield "[name='password']"
    And I set "testtest" to the inputfield "[name='password_confirmation']"
    When I click on the element "button=Register New Account"
    Then I expect that element ".header=New user is registered!" becomes visible

  Scenario: Register a new account with mismatch password and password confirmation
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Sign-Up"
    Then I expect that the url is "https://localhost:3000/#/marketplace/register"
    And I expect that element ".header=Create New Account" is visible
    Given I register new account in Marketplace
    And I set "testtest" to the inputfield "[name='password']"
    And I set "testtest1" to the inputfield "[name='password_confirmation']"
    Then I expect that element "button.disabled=Register New Account" is visible

  Scenario: Register a new account with blank password
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Sign-Up"
    Then I expect that the url is "https://localhost:3000/#/marketplace/register"
    And I expect that element ".header=Create New Account" is visible
    Given I register new account in Marketplace
    Then I expect that element "button.disabled=Register New Account" is visible

  Scenario: Register a new account with blank password confirmation
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Sign-Up"
    Then I expect that the url is "https://localhost:3000/#/marketplace/register"
    And I expect that element ".header=Create New Account" is visible
    Given I register new account in Marketplace
    And I set "testtest" to the inputfield "[name='password']"
    Then I expect that element "button.disabled=Register New Account" is visible

  Scenario: Register an existing account with correct password
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Sign-Up"
    Then I expect that the url is "https://localhost:3000/#/marketplace/register"
    And I expect that element ".header=Create New Account" is visible
    Given I register existing account in Marketplace
    And I set "testtest" to the inputfield "[name='password']"
    And I set "testtest" to the inputfield "[name='password_confirmation']"
    When I click on the element "button=Register New Account"
    Then I expect that element "p=Email has already been taken" becomes visible

  Scenario: Buy DGX Tokens
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Purchase"
    Then I expect that the url is "https://localhost:3000/#/marketplace/dgx"
    And I expect that element "button=Import Wallet File" becomes visible
    And I expect that element "button=Ledger Wallet" becomes visible
    When I click on the element "button=Import Wallet File"
    Then I expect that element ".header=Import Wallet File" becomes visible
    When I import keystore "recaster.json" on the filefield "[type='file']"
    Then I expect that element "button=Unlock Wallet" becomes visible
    When I set "digixtest" to the inputfield "[type='password']"
    And I click on the element "button=Unlock Wallet"
    Then I expect that element "button=Purchase DGX Now" becomes visible
    When I click on the element "button=Purchase DGX Now"
    Then I expect that element ".header=Purchase DGX" becomes visible
    And I expect that element "[name='ethValue']" becomes visible
    When I set ".1" to the inputfield "[name='ethValue']"
    Then I expect that element "button=Lock Price & Purchase DGX" becomes visible
    When I click on the element "button=Lock Price & Purchase DGX"
    Then I expect that element "button=Sign Transaction" becomes visible
    When I set "digixtest" to the inputfield "[type='password']"
    And I click on the element "button=Sign Transaction"
    # below should be Successful instead of Succesful
    Then I expect that element "div=Transaction was Succesful!" becomes visible
    And I click on the element "button=Done"

  Scenario: Not be able to purchase DGX token using unregistered wallet
    Given I open the url "https://localhost:3000/#/marketplace"
    When I click on the link "Purchase"
    Then I expect that the url is "https://localhost:3000/#/marketplace/dgx"
    When I refresh the page
    And I expect that element "button=Import Wallet File" becomes visible
    And I expect that element "button=Ledger Wallet" becomes visible
    When I click on the element "button=Import Wallet File"
    Then I expect that element ".header=Import Wallet File" becomes visible
    When I import keystore "uploader.json" on the filefield "[type='file']"
    Then I expect that element "button=Unlock Wallet" becomes visible
    When I set "digixtest" to the inputfield "[type='password']"
    And I click on the element "button=Unlock Wallet"
    Then I expect that element "p=Sorry, this address is not registered yet." becomes visible

# TODO: Tests with ledger functionality?