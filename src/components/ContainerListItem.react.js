import $ from 'jquery';
import React from 'react/addons';
import Router from 'react-router';
import electron from 'electron';
const remote = electron.remote;
const dialog = remote.dialog;
import metrics from '../utils/MetricsUtil';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

var ContainerListItem = React.createClass({
  handleItemMouseEnter: function () {
    var $action = $(this.getDOMNode()).find('.action');
    $action.show();
  },
  handleItemMouseLeave: function () {
    var $action = $(this.getDOMNode()).find('.action');
    $action.hide();
  },
  handleClick: function () {
    this.props.current(this.props.container.name );
  },
  handleDeleteContainer: function (e) {
    e.preventDefault();
    e.stopPropagation();
    dialog.showMessageBox({
      message: 'Are you sure you want to remove this snippet?',
      buttons: ['Remove', 'Cancel']
    }, function (index) {
      if (index === 0) {
        this.props.delete(this.props.container);
        metrics.track('Deleted Container', {
          from: 'list',
          type: 'existing'
        });
      }
    }.bind(this));
  },
  render: function () {
    var self = this;
    var container = this.props.container;
    var repo = container.Name;
    var imageName = (
      <OverlayTrigger placement="bottom" overlay={<Tooltip>{container.Name}</Tooltip>}>
        <span>{repo}</span>
      </OverlayTrigger>
    );

    // Synchronize all animations
    var style = {
      WebkitAnimationDelay: 0 + 'ms'
    };

    var state;
      state = (
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Stopped</Tooltip>}>
          <div className="state state-stopped"></div>
        </OverlayTrigger>
      );

    return (
        <li id={container.name} onMouseEnter={self.handleItemMouseEnter} onMouseLeave={self.handleItemMouseLeave} onClick={self.handleClick}>
          {state}
          <div className="info">
            <div className="name">
              {container.name}
            </div>
            <div className="image">
              {imageName}
            </div>
          </div>
          <div className="action">
            <span className="btn circular" onClick={this.handleDeleteContainer}><span className="icon icon-delete"></span></span>
          </div>
        </li>
    );
  }
});

module.exports = ContainerListItem;
