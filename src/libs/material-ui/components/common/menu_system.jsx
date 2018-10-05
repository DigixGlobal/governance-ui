import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Menu, Dropdown, Container } from 'semantic-ui-react';
import { Redirect, Switch, Route } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import ActiveLink from '~/libs/material-ui/components/common/active_link';

import MenuSystemDropdown from './menu_system_dropdown';

export default class MenuSystem extends Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    className: PropTypes.string,
    renderLastItem: PropTypes.func,
    marginTop: PropTypes.string,
    equalWidths: PropTypes.bool,
    usingRouter: PropTypes.bool,
    parentRoute: PropTypes.string,
    childProps: PropTypes.object,
    menuProps: PropTypes.object,
    renderFooter: PropTypes.func,
    renderTab: PropTypes.func,
    hidden: PropTypes.bool,
    dropdown: PropTypes.bool,
  };
  static defaultProps = {
    className: undefined,
    renderLastItem: undefined,
    marginTop: '',
    equalWidths: undefined,
    usingRouter: false,
    parentRoute: undefined,
    childProps: undefined,
    menuProps: undefined,
    renderFooter: undefined,
    renderTab: undefined,
    dropdown: false,
    hidden: false,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { tab: 0 };
  }
  handleClick(tab) {
    this.setState({ tab });
  }
  renderItems(mappedTabs) {
    const { renderTab, dropdown } = this.props;
    const ItemComp = dropdown ? MenuItem : Button;
    return mappedTabs.map(({ hidden, exact, icon, key, content, active, as, to, onClick, disabled, props }) => {
      if (hidden) {
        return null;
      }
      if (renderTab) {
        return renderTab({ exact, icon, key, content, active, as, to, onClick, disabled, ...props });
      }
      // return <Button color="inherit">{content}</Button>;
      return (
        <ItemComp color="inherit" {...{ exact, icon, key, content, active, as, to, onClick, disabled, ...props }}>
          {content}
        </ItemComp>
      );
    });
  }
  render() {
    const { tab } = this.state;
    const {
      childProps,
      usingRouter,
      menuProps,
      parentRoute,
      className,
      tabs,
      marginTop,
      equalWidths,
      renderFooter,
      renderLastItem,
      dropdown,
    } = this.props;
    const MenuComp = dropdown ? MenuSystemDropdown : Button;
    const mappedTabs = tabs.map(({ name, hidden, exact, icon, component, path, render, props }, i) => {
      const absolutePath = parentRoute && path[0] !== '/' ? `${parentRoute}/${path}` : path;

      return {
        exact,
        icon,
        component,
        hidden,
        props,
        render,
        path: absolutePath,
        key: absolutePath,
        content: name,
        active: !usingRouter ? tab === i : undefined,
        as: usingRouter ? ActiveLink : undefined,
        to: usingRouter ? absolutePath : undefined,
        onClick: () => this.handleClick(i),
      };
    });
    return (
      <div className={className}>
        {/* {!this.props.hidden &&
          <MenuComp
            widths={equalWidths ? tabs.filter(t => !t.hidden).length : undefined}
            {...menuProps}
          >
            {dropdown ?
              this.renderItems(mappedTabs).concat((renderLastItem && renderLastItem()) || [])
            :
              <Container>
                {this.renderItems(mappedTabs)}
                {renderLastItem && renderLastItem()}
              </Container>
            }
          </MenuComp>
        } */}
        <AppBar color="primary" position="static">
          <Toolbar>{this.renderItems(mappedTabs).concat((renderLastItem && renderLastItem()) || [])}</Toolbar>
        </AppBar>
        <div fluid style={{ marginTop: !this.props.hidden ? marginTop : undefined }}>
          {usingRouter ? (
            <Switch>
              {mappedTabs.map(({ key, path, component: Comp, exact, render, redirect, redirectFrom, redirectTo, props }) => (
                <Route
                  {...{
                    key,
                    path,
                    component: !childProps ? Comp : undefined,
                    render: render || (() => <Comp {...childProps} {...props} />),
                    exact,
                  }}
                />
              ))}
              {parentRoute && <Redirect from={parentRoute} to={mappedTabs[0].path} />}
            </Switch>
          ) : (
            tabs[tab].component
          )}
          {renderFooter && renderFooter(tab)}
        </div>
      </div>
    );
  }
}
