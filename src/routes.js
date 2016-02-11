import React from 'react/addons';
import Containers from './components/Containers.react';
import Preferences from './components/Preferences.react';
import Loading from './components/Loading.react';
import NewContainerSearch from './components/NewContainerSearch.react';
import Router from 'react-router';

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <RouteHandler/>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="containers" path="containers" handler={Containers}>
      <Route name="search" handler={NewContainerSearch}/>
      <Route name="preferences" path="preferences" handler={Preferences}/>
    </Route>
    <DefaultRoute name="loading" handler={Loading}/>
  </Route>
);

module.exports = routes;
