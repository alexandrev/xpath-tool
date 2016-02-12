import fs from 'fs';


let SNIPPET_FILE = 'snippets.json';

class SnippetStore {
  constructor () {
    this.snippets = [];
    fs.readFile(SNIPPET_FILE, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      super.snippets = eval(data);
      console.log(data);
    });
  }

  add (obj) {
    this.snippets.push(obj);
    this.write();
  }

  write () {
    let content = JSON.stringify(this.snippets);
    fs.writeFile(SNIPPET_FILE, content, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
  }





}

module.exports = SnippetStore;
