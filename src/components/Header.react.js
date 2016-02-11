import React from 'react/addons';
import RetinaImage from 'react-retina-image';
import util from '../utils/Util';
import metrics from '../utils/MetricsUtil';
import electron from 'electron';
const remote = electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
import accountStore from '../stores/AccountStore';
import accountActions from '../actions/AccountActions';
import Router from 'react-router';
import classNames from 'classnames';

var Header = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function () {
    return {
      fullscreen: false,
      updateAvailable: false,
    };
  },
  update: function () {
    let accountState = accountStore.getState();
    this.setState({
    });
  },
  handleDocumentKeyUp: function (e) {
    if (e.keyCode === 27 && remote.getCurrentWindow().isFullScreen()) {
      remote.getCurrentWindow().setFullScreen(false);
      this.forceUpdate();
    }
  },
  handleClose: function () {
    if (util.isWindows()) {
      remote.getCurrentWindow().close();
    } else {
      remote.getCurrentWindow().hide();
    }
  },
  handleMinimize: function () {
    remote.getCurrentWindow().minimize();
  },
  handleFullscreen: function () {
    if (util.isWindows()) {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
      } else {
        remote.getCurrentWindow().maximize();
      }
      this.setState({
        fullscreen: remote.getCurrentWindow().isMaximized()
      });
    } else {
      remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
      this.setState({
        fullscreen: remote.getCurrentWindow().isFullScreen()
      });
    }
  },
  handleFullscreenHover: function () {
    this.update();
  },  
  renderWindowButtons: function () {
    let buttons;
    if (util.isWindows()) {
      buttons = (
        <div className="windows-buttons">
        <div className="windows-button button-minimize enabled" onClick={this.handleMinimize}><div className="icon"></div></div>
        <div className={`windows-button ${this.state.fullscreen ? 'button-fullscreenclose' : 'button-fullscreen'} enabled`} onClick={this.handleFullscreen}><div className="icon"></div></div>
        <div className="windows-button button-close enabled" onClick={this.handleClose}></div>
        </div>
      );
    } else {
      buttons = (
        <div className="buttons">
        <div className="button button-close enabled" onClick={this.handleClose}></div>
        <div className="button button-minimize enabled" onClick={this.handleMinimize}></div>
        <div className="button button-fullscreen enabled" onClick={this.handleFullscreen}></div>
        </div>
      );
    }
    return buttons;
  },
  renderDashboardHeader: function () {
    let headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows () ?  '' : this.renderWindowButtons() }
        </div>
        <div className="right-header">
          {util.isWindows () ? this.renderWindowButtons() : ''}
        </div>
      </div>
    );
  },
  renderBasicHeader: function () {
    let headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows () ? null : this.renderWindowButtons()}
        </div>
        <div className="right-header">
          {util.isWindows () ? this.renderWindowButtons() : null}
        </div>
      </div>
    );
  },
  render: function () {
    if (this.props.hideLogin) {
      return this.renderBasicHeader();
    } else {
      return this.renderDashboardHeader();
    }
  }
});

module.exports = Header;
