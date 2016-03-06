import React from 'react/addons';
import Router from 'react-router';
import classNames from 'classnames';
import $ from 'jquery';
import electron from 'electron';
import fs from 'fs';
import AceEditor from 'react-ace';
import 'brace/mode/xml';
import 'brace/theme/github';
const remote = electron.remote;
const dialog = remote.dialog;

module.exports = React.createClass({
  mixins: [Router.Navigation, Router.State],
  getInitialState: function () {
    return {
      current: this.props.container || {},
      fileContent: ''
    };
  },
  componentDidMount: function () {
    var dropTarget = document.getElementById('fileZone');
    var self = this;
    require('drag-and-drop-files')(dropTarget, function (files) {
      if ( files !== null && files.length > 0) {
        let current = self.state.current;
        if (current.name != null) {
          current.filePath = files[0].path;
          self.setState({current: current});
        }
      }
    });
    let newSnippetOnStartup = localStorage.getItem('settings.emptySnippetOnStartup');
    if (newSnippetOnStartup && this.props.containers.length === 0) {
      this.props.newSnippet();
    }
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps !== this.props) {
      this.setState({
        current: this.props.container || {},
        fileContent: ''
      });

      if (this.props.container.filePath !== null && this.props.container.filePath !== '' ) {
        this.refreshFileContent(this.props.container.filePath);
      }
    }

    if (prevState !== this.state) {
      localStorage.setItem('snippets', JSON.stringify(this.props.containers));
    }
  },
  getResultContent: function (xpathExpression, fileContent) {
    var out = '';
    var xmldom = require('xmldom');
    var ParseDOM = xmldom.DOMParser;
    var xpath=require('xpath2.js');
    var xml = fileContent;
    try {
      if (xml != null && xml !== '') {
        var doc = new ParseDOM().parseFromString(xml);
        // TODO Namespace option setting
        let select = xpath;
        // if( true ) {
        let namespacesMap = doc.documentElement._nsMap;
        if (namespacesMap != null) {
          // select = xpath.useNamespaces(namespacesMap);
        }
        // }

        if (xpathExpression != null && xpathExpression !== '' && !xpathExpression.endsWith("'") && !xpathExpression.endsWith("\"")){
          out = xpath(doc,  xpathExpression).toString();
        }

        let current = this.state.current;
        this.setOKStatus('');
        current.xpath = xpathExpression;
      }
    } catch (err) {
      this.setStatusError(err);
      console.log(err);
    }
    return out;
  },
  getFileContent: function (filePath) {
    let out = '';
    if (filePath != null && filePath !== '') {
      out = fs.readFileSync(filePath, 'utf8');
    }
    return out;
  },
  refreshFileContent: function (filePath) {
    if (filePath != null && filePath !== '') {
      let data = fs.readFileSync(filePath, 'utf8');
      if (data !== null) {
        $('#fileContent').val(data);
        console.log(data);
      }else {
        $('#fileContent').val('');
      }
    }else {
      $('#fileContent').val('');
    }
  },

  handleChangeFilePath: function (e) {
    let filePath = e.target.value;
    let current = this.state.current;
    filePath = filePath.trim();
    if (filePath !== '' && filePath !== this.state.current.filePath) {
      current.filePath = filePath;
      this.refreshFileContent(filePath);
      this.setState({current: current});
    }
  },
  setStatusError: function (e) {
    $('#statusButton').removeClass('btn-success');
    $('#statusButton').addClass('btn-danger');
    $('#statusButton').text('Error');
    $('#statusMsg').text(e);
  },
  setOKStatus: function (e) {
    $('#statusButton').removeClass('btn-danger');
    $('#statusButton').addClass('btn-success');
    $('#statusButton').text('No Errors');
    $('#statusMsg').text(e);
  },
  handleChangeXPathExpression: function (e) {
    let xpathExpression = e.target.value;
    let current = this.state.current;
    if (xpathExpression != null && xpathExpression !== current.xpath) {
      current.xpath = xpathExpression;
      this.setState({current: current});
    }
  },
  handlePage: function (page) {
    let query = this.state.query;
    this.search(query, page);
  },
  loadFilePath: function () {
    let newFilePath = dialog.showOpenDialog({ properties: [ 'openFile' ], filters: [
    { name: 'XML File Documents', extensions: ['xml', 'xsd'] },
    { name: 'All Files', extensions: ['*'] }
    ]});

    if (newFilePath != null) {
      $('#filePath').val(newFilePath[0]);
      this.handleChangeFilePath({target: { value: newFilePath[0]}});
    }

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

    let xpathExpression = this.state.current.xpath;
    let filePath = this.state.current.filePath;
    let fileContent = this.getFileContent(filePath);
    let resultContent = this.getResultContent(xpathExpression, fileContent);


    return (
      <div className='details'>
        <div className='new-container'>
          <div className='new-container-header'>
            <div className='search'>
              <div className='search-bar'>
                <input type='search' id='filePath' ref='searchInput' disabled={typeof this.state.current.name === 'undefined'} onChange={this.handleChangeFilePath} className='form-control' placeholder='Feed me with some file path from your computer..' value={filePath} />
                <div className={magnifierClasses}></div>
                <div className={loadingClasses}><div></div></div>
                <div className='results-filters'>
                  <span className='results-filter results-all tab'><button className='browse-button btn btn-primary' type='button' onClick={this.loadFilePath} disabled={typeof this.state.current.name === 'undefined'}> Browse </button></span>
                </div>
              </div>
            </div>
            <div className='results-filters'>
              <span className='results-filter results-filter-title'>OPTIONS</span>
              <span className={`results-filter results-all tab`} >Namespace</span>
              <span className={`results-filter results-recommended tab`}>No Namespace</span>
            </div>
          </div>
          <div id="fileZone" className="panel-text" height='70%' >
            <AceEditor name='panel-text' width='100%' readOnly={true} mode='xml' theme='github' value={fileContent}/>
          </div>
          <div className='new-container-header'>
            <div className='search-full'>
              <div className='search-bar'>
                <input type='search' ref='searchInput' disabled={typeof this.state.current.name === 'undefined'} className='form-control' value={xpathExpression} placeholder='Put your XPath Expression here :)' onChange={this.handleChangeXPathExpression} />
                <div className={magnifierClasses}></div>
                <div className={loadingClasses}><div></div></div>
              </div>
            </div>
            </div>
          <div className='small-panel-text' height='30%' width='100%'>
            <AceEditor className='small-panel-text' width='100%' readOnly={true} mode='xml' theme='github' value={resultContent} />
          </div>

        </div>
        <section className='sidebar-buttons'>
          <button type='button' id='statusButton' className='btn btn-success'>No Errors</button><span id='statusMsg'></span>
        </section>
      </div>
    );
  }
});
