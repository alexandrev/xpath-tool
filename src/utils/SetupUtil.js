import _ from 'underscore';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import bugsnag from 'bugsnag-js';
import util from './Util';
import setupServerActions from '../actions/SetupServerActions';
import metrics from './MetricsUtil';
import router from '../router';

// Docker Machine exits with 3 to differentiate pre-create check failures (e.g.
// virtualization isn't enabled) from normal errors during create (exit code
// 1).
const precreateCheckExitCode = 3;

let _retryPromise = null;
let _timers = [];

export default {
  simulateProgress (estimateSeconds) {
    this.clearTimers();
    var times = _.range(0, estimateSeconds * 1000, 200);
    _.each(times, time => {
      var timer = setTimeout(() => {
        setupServerActions.progress({progress: 100 * time / (estimateSeconds * 1000)});
      }, time);
      _timers.push(timer);
    });
  },

  clearTimers () {
    _timers.forEach(t => clearTimeout(t));
    _timers = [];
  },

  retry (removeVM) {
    metrics.track('Retried Setup', {
      removeVM
    });

    router.get().transitionTo('loading');
    if (removeVM) {
    } else {
      _retryPromise.resolve();
    }
  },

  pause () {
    _retryPromise = Promise.defer();
    return _retryPromise.promise;
  },

  setup() {
    return util.isLinux() ? this.nativeSetup() : this.nonNativeSetup();
  },

  async nativeSetup () {

  },

  async nonNativeSetup () {        
  }
};
