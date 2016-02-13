require.main.paths.splice(0, 0, process.env.NODE_PATH);
import electron from 'electron';
const remote = electron.remote;
const Menu = remote.Menu;
// ipcRenderer is used as we're in the process
const ipcRenderer = electron.ipcRenderer;

import React from 'react';

import metrics from './utils/MetricsUtil';
import template from './menutemplate';
import webUtil from './utils/WebUtil';
import setupUtil from './utils/SetupUtil';
import Router from 'react-router';
import routes from './routes';
import routerContainer from './router';




webUtil.addWindowSizeSaving();
webUtil.addLiveReload();
webUtil.addBugReporting();
webUtil.disableGlobalBackspace();

Menu.setApplicationMenu(Menu.buildFromTemplate(template()));

metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(function () {
  metrics.track('app heartbeat');
}, 14400000);

var router = Router.create({
  routes: routes
});
router.run(Handler => React.render(<Handler/>, document.body));
routerContainer.set(router);



setupUtil.setup().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template()));
  router.transitionTo('search');
}).catch(err => {
  metrics.track('Setup Failed', {
    step: 'catch',
    message: err.message
  });
  throw err;
});

ipcRenderer.on('application:quitting', () => {

});