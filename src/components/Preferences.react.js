import React from 'react/addons';
import metrics from '../utils/MetricsUtil';
import Router from 'react-router';

var Preferences = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function () {
    return {
      emptySnippetOnStartup: localStorage.getItem('settings.emptySnippetOnStartup') === 'true',
      metricsEnabled: metrics.enabled()
    };
  },
  handleGoBackClick: function () {
    this.goBack();
    metrics.track('Went Back From Preferences');
  },
  handleChangeEmptySnippetOnStartup: function (e) {
    var checked = e.target.checked;
    this.setState({
      emptySnippetOnStartup: checked
    });
    localStorage.setItem('settings.emptySnippetOnStartup', checked);
    metrics.track('Toggled Empty Snippet on Startup', {
      close: checked
    });
  },
  handleChangeMetricsEnabled: function (e) {
    var checked = e.target.checked;
    this.setState({
      metricsEnabled: checked
    });
    metrics.setEnabled(checked);
    metrics.track('Toggled util/MetricsUtil', {
      enabled: checked
    });
  },
  render: function () {
    var vmSettings;

    if (process.platform !== 'linux') {
      vmSettings = (
        <div>
          <div className="title"> General Settings</div>
          <div className="option">
            <div className="option-name">
             Create automatically a empty snippet on startup
            </div>
            <div className="option-value">
              <input type="checkbox" checked={this.state.emptySnippetOnStartup} onChange={this.handleChangeEmptySnippetOnStartup}/>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="preferences">
        <div className="preferences-content">
          <a onClick={this.handleGoBackClick}>Go Back</a>
          {vmSettings}
          <div className="title">App Settings</div>
          <div className="option">
            <div className="option-name">
              Option 1
            </div>
            <div className="option-value">
              <input type="checkbox" checked={this.state.metricsEnabled} onChange={this.handleChangeMetricsEnabled}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Preferences;
