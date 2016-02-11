import React from 'react/addons';
import Router from 'react-router';
import classNames from 'classnames';
import $ from 'jquery';
import electron from 'electron';
const remote = electron.remote;
const dialog = remote.dialog;

module.exports = React.createClass({
  mixins: [Router.Navigation, Router.State],
  getInitialState: function () {
    return {
      filePath: '',
      xpathExpression: ''
    };
  },
  handleChangeFilePath: function (e) {
    let filePath = e.target.value;
    filePath = filePath.trim();
    if (filePath !== '' && filePath !== this.state.filePath) {
      let fs = require('fs');
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        $('#fileContent').val(data);
        console.log(data);
      });
      this.setState({filePath: filePath});
    }
  },
  setStatusError: function (e) {
    $("#statusButton").removeClass("btn-success");
    $("#statusButton").addClass("btn-danger");
    $("#statusButton").text("Error");
    $("#statusMsg").text(e);
  },
  setOKStatus: function (e) {
    $("#statusButton").removeClass("btn-danger");
    $("#statusButton").addClass("btn-success");
    $("#statusButton").text("No Errors");
    $("#statusMsg").text(e);
  },
  handleChangeXPathExpression: function (e) {
    let xpathExpression = e.target.value;
    if (xpathExpression !== '' && xpathExpression !== this.state.xpathExpression) {
      var xpath = require('xpath.js'), dom = require('xmldom').DOMParser;
      var xml = $('#fileContent').val();
      try {
        var doc = new dom().parseFromString(xml);
        var nodes = xpath(doc,xpathExpression);
        $('#resultViewer').val(nodes);
        this.setOKStatus('');
        this.setState({xpathExpression: xpathExpression});
      } catch (err) {
        this.setStatusError(err);
        console.log(err);
      }
    }
  },
  handlePage: function (page) {
    let query = this.state.query;
    this.search(query, page);
  },
  loadFilePath: function () {
    let newFilePath = dialog.showOpenDialog({ properties: [ 'openFile' ]});
    $('#filePath').val(newFilePath[0]);
    this.handleChangeFilePath({target : { value: newFilePath[0]}});

  },
  render: function () {

    let loadingClasses = classNames({
      hidden: !this.state.loading,
      spinner: true,
      loading: true,
      'la-ball-clip-rotate': true,
      'la-dark': true,
      'la-sm': true
    });

    let magnifierClasses = classNames({
      hidden: this.state.loading,
      icon: true,
      'icon-search': true,
      'search-icon': true
    });

    return (
      <div className="details">
        <div className="new-container">
          <div className="new-container-header">
            <div className="search">
              <div className="search-bar">
                <input type="search" id="filePath" ref="searchInput" onChange={this.handleChangeFilePath} className="form-control" placeholder="Set the file path here :)"  />
                <div className={magnifierClasses}></div>
                <div className={loadingClasses}><div></div></div>
                <div className="results-filters">
                <button className="browse-button btn btn-primary" type="button" onClick={this.loadFilePath}> Browse </button>
                </div>
              </div>
            </div>
            <div className="results-filters">
              <span className="results-filter results-filter-title">OPTIONS</span>
              <span className={`results-filter results-all tab`} >Namespace</span>
              <span className={`results-filter results-recommended tab`}>No Namespace</span>
            </div>
          </div>
          <div className="panel-text">
            <textarea cols="40" rows="4"  className="large-panel-text"  id="fileContent" ></textarea>
          </div>
          <div className="new-container-header">
            <div className="search-full">
              <div className="search-bar">
                <input type="search" ref="searchInput" className="form-control" placeholder="Set your XPath expression here" onChange={this.handleChangeXPathExpression}/>
                <div className={magnifierClasses}></div>
                <div className={loadingClasses}><div></div></div>
              </div>
            </div>
            </div>
          <div className="small-panel-text">
            <textarea cols="40" rows="5" className="mini-panel-text" id="resultViewer"></textarea>
          </div>

        </div>
        <section className="sidebar-buttons">
          <button type="button" id="statusButton" className="btn btn-success">No Errors</button><span id="statusMsg"></span>
        </section>
      </div>
    );
  }
});
