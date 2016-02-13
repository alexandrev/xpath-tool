import React from 'react/addons';
import ContainerListItem from './ContainerListItem.react';

var ContainerList = React.createClass({
  componentWillMount: function () {
    this.start = Date.now();
  },
  render: function () {
    var containers = this.props.containers.map(container => {
      return (
        <ContainerListItem key={container.name} container={container} current={this.props.update} delete={this.props.delete} /> 
      );
    });
    return (
      <ul>
        {containers}
      </ul>
    );
  }
});

module.exports = ContainerList;
