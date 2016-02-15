import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import ContainerList from './ContainerList.react';
import Header from './Header.react';
import metrics from '../utils/MetricsUtil';

var Containers = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    let tmp = [];
    try {
      tmp = JSON.parse(localStorage.getItem('snippets'));
      if (tmp === null) {
        tmp = [];
      }
    } catch (e) {
      console.log(e);
    }
    return {
      sidebarOffset: 0,
      containers: tmp,
      updated: null,
      update: this.current.bind(this),
      delete: this.delete.bind(this),
      current: null
    };
  },

  delete: function (container) {
    let current = null;
    let containers = this.state.containers;
    for (let idx in containers) {
      if (container === containers[idx]) {
        current = containers[idx];
        break;
      }
    }

    if (current != null) {
      var index = containers.indexOf(current);
      if (index > -1) {
        containers.splice(index, 1);
      }
      localStorage.setItem('snippets', JSON.stringify(containers));
      this.setState({ containers: containers, updated: new Date()});
    }
    this.refreshCurrent();
  },

  current: function (name) {
    let current = this.state.current;
    for (let idx in this.state.containers) {
      if (this.state.containers.hasOwnProperty(idx)) {
        let parent = $('#' + this.state.containers[idx].name);
        if ( name === this.state.containers[idx].name) {
          current = this.state.containers[idx];
          parent.addClass('active');
        } else {
          parent.removeClass('active');
        }
      }
    }
    this.setState({current: current});
  },

  refreshCurrent: function () {
    let current = this.state.current;
    let found = false;
    for ( let idx in this.state.containers) {
      if ( current === this.state.containers[idx]) {
        current = this.state.containers[idx];
        found = true;
        break;
      }
    }

    if (!found) {
      current = null;
    }

    this.setState({current: current});
  },

  update: function () {
    let containers = this.state.containers;
    let name = this.context.router.getCurrentParams().name;
    if (name && !containers[name]) {
      this.context.router.transitionTo('search', {name: name});
    } else {
      this.context.router.transitionTo('search');
    }


    this.setState({
      containers: containers,
      updated: new Date()
    });
  },

  handleScroll: function (e) {
    if (e.target.scrollTop > 0 && !this.state.sidebarOffset) {
      this.setState({
        sidebarOffset: e.target.scrollTop
      });
    } else if (e.target.scrollTop === 0 && this.state.sidebarOffset) {
      this.setState({
        sidebarOffset: 0
      });
    }
  },

  generateName: function () {
    let containers = this.state.containers;
    let numbers = [];
    for (let idx in containers) {
      if (containers.hasOwnProperty(idx)) {
        let name = this.state.containers[idx].name;
        if (name.startsWith('NewSnippet-')) {
          let parts = name.split('-');
          numbers.push(parseInt(parts[1], 10));
        }
      }
    }
    let target = 1;
    let exit = false;
    while (!exit) {
      if (numbers.indexOf(target) !== -1) {
        target++;
      }else {
        exit = true;
      }
    }
    return 'NewSnippet-' + target;
  },
  handleNewContainer: function () {
    $(this.getDOMNode()).find('.new-container-item').parent().fadeIn();

    let containers = this.state.containers;
    let name = this.generateName();

    containers.push({ name: name, filePath: '', xpath: ''});
    this.refreshCurrent();
    localStorage.setItem('snippets', JSON.stringify(this.state.containers));
    this.setState({ containers: containers, updated: new Date()});

    metrics.track('Pressed New Container');
  },

  handleClickPreferences: function () {
    metrics.track('Opened Preferences', {
      from: 'app'
    });
    this.context.router.transitionTo('preferences');
  },

  handleMouseEnterPreferences: function () {
    this.setState({
      currentButtonLabel: 'Change app preferences.'
    });
  },

  handleMouseLeavePreferences: function () {
    this.setState({
      currentButtonLabel: ''
    });
  },

  render: function () {
    var sidebarHeaderClass = 'sidebar-header';
    if (this.state.sidebarOffset) {
      sidebarHeaderClass += ' sep';
    }

    var container = this.state.current || {};
    return (
      <div className="containers">
        <Header />
        <div className="containers-body">
          <div className="sidebar">
            <section className={sidebarHeaderClass}>
              <h4>Snippets</h4>
              <div className="create">
                  <span className="btn btn-new btn-action has-icon btn-hollow" onClick={this.handleNewContainer}><span className="icon icon-add"></span>New</span>
              </div>
            </section>
            <section className="sidebar-containers" onScroll={this.handleScroll}>
              <ContainerList containers={this.state.containers} update={this.state.update} delete={this.state.delete}/>
            </section>
            <section className="sidebar-buttons">
              <span className="btn-sidebar btn-preferences" onClick={this.handleClickPreferences} onMouseEnter={this.handleMouseEnterDockerTerminal} onMouseLeave={this.handleMouseLeaveDockerTerminal}><span className="icon icon-preferences"></span></span>
            </section>
          </div>
          <Router.RouteHandler containers={this.state.containers} container={container} />
        </div>
      </div>
    );
  }
});

module.exports = Containers;
