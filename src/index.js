import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';

class VideoForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          title: null,
          url: null,
          id: null
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.request = this.request.bind(this);
      }
    
      handleChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
      }
    
      request(event, type) {
        event.preventDefault();

        switch (type) {
          case "all":
            talkToService(null, "all", null, null)
            break;
          case "single":
            talkToService(this.state.id, "single", null, null)
            break;
          case "create":
            talkToService(null, "create", this.state.title, this.state.url)
            break;
          case "edit":
            talkToService(null, "edit", this.state.title, this.state.url)
            break;
          case "delete":
            talkToService(this.state.id, "delete", null, null)
            break;
          default:
            break;
        }
      }

    render() {
        return (
          <div className="row">
            <div className="col-md-3 mt-2 form-area">
              <form onSubmit={e => this.request(e, "all")}>
                  <input type="submit" value="Show me the videos" className="btn btn-primary" />
              </form>
            </div>

            <div className="col-md-3 mt-2 form-area">
              <form onSubmit={e => this.request(e, "single")}>
                <div className="form-group">
                  <label for="singleRequest">ID</label>
                  <input id="singleRequest" class="form-control" type="text" name="id" value={this.state.id} onChange={this.handleChange} />
                </div>
                <input type="submit" value="Show me 1 video" className="btn btn-info" />
              </form>
            </div>

            <div className="col-md-3 mt-2 form-area">
              <form onSubmit={e => this.request(e, "create")}>
              <div className="form-group">
                <label for="createRequest">Name: </label>
                <input id="createRequest" class="form-control" type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                <label for="createRequest">URL: </label>
                <input type="text" class="form-control" name="url" value={this.state.url} onChange={this.handleChange} />
              </div>
                <input type="submit" value="Create video" className="btn btn-success" />
              </form>
            </div>

            <div className="col-md-3 mt-2 form-area">
              <form onSubmit={e => this.request(e, "edit")}>
              <div className="form-group">
                  <label for="createRequestid">ID</label>
                  <input id="createRequestid" class="form-control" type="text" name="id" value={this.state.id} onChange={this.handleChange} />
                </div>
              <div className="form-group">
                <label for="createRequestname">Name: </label>
                <input id="createRequestname" class="form-control" type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                <label for="createRequesturl">URL: </label>
                <input id="createRequesturl" type="text" class="form-control" name="url" value={this.state.url} onChange={this.handleChange} />
              </div>
                <input type="submit" value="Edit" className="btn btn-warning" />
              </form>
            </div>
          </div>
        );
      }
}

  ReactDOM.render(<VideoForm />, document.getElementById('jumbotron-button'));

  function talkToService(id = 0, type = "all", name = "default", url = "default") {

    //all - Gets everything available (Default)
    //single - Gets results based on id
    //new - Creates new record 
    //edit - Edits a record based on id
    //delete - Deletes a record based on id

    var resultElement = document.getElementById('results');
    resultElement.innerHTML = '';

    //returns all of the results
    if (type === "all") {
      axios.get('http://127.0.0.1:8080/api/webservice/', {
          mode: 'cors'
        })
        .then(
          function (response) {
            console.log(response);
            resultElement.innerHTML = genJsonStringOutput(response);
          }
        )
        .catch(function (error) {
          resultElement.innerHTML = genErrorOutput(error);
        });
    }

    //returns results based on sent id
    if (type === "single") {
      axios.get('http://127.0.0.1:8080/api/webservice/', {
          mode: 'cors',
          params: {
            id: id
          }
        })
        .then(function (response) {
          resultElement.innerHTML = genJsonObjectOutput(response);
        })
        .catch(function (error) {
          resultElement.innerHTML = genErrorOutput(error);
        });
    }

    //creates new entry
    if (type === "create") {
      axios.post('http://127.0.0.1:8080/api/webservice/', {
        mode: 'cors',
        params: {
          id: null,
          name: name,
          url: url
        }
        })
        .then(function (response) {
          resultElement.innerHTML = genJsonObjectOutput(response);
        })
        .catch(function (error) {
          resultElement.innerHTML = genErrorOutput(error);
        });
    }

    //creates new entry
    if (type === "edit") {
      axios.put('http://127.0.0.1:8080/api/webservice/', {
        mode: 'cors',
        params: {
          id: id,
          name: name,
          url: url
        }
        })
        .then(function (response) {
          resultElement.innerHTML = '<pre>Successfully edited.</pre>';
        })
        .catch(function (error) {
          resultElement.innerHTML = genErrorOutput(error);
        });
    }

    //creates new entry
    if (type === "delete") {
      axios.put('http://127.0.0.1:8080/api/webservice/', {
        mode: 'cors',
        params: {
          id: id
        }
        })
        .then(function (response) {
          resultElement.innerHTML = '<pre>Successfully deleted.</pre>';
        })
        .catch(function (error) {
          resultElement.innerHTML = genErrorOutput(error);
        });
    }


  }

  function genJsonStringOutput(response) {
    var output = '';
    var jsonRes = JSON.parse(response.data);
    for (var i = 0; i < jsonRes.length; i++) {
      output = output + '<pre>' +
        '<span>' + jsonRes[i].id + '</span>' + '<br>' +
        '<span>' + jsonRes[i].name + '</span>' + '<br>' +
        '<span>' + jsonRes[i].url + '</span>' + '<br>' +
        '<object style="width: 420px; height: 315px; float: none; clear: both; margin: 2px auto;" data="' + jsonRes[i].url + '"></object>' +
        '<form onSubmit={e => this.request(e, "delete")}>' +
        '<input type="hidden" name="id" value="' + jsonRes[i].id + '" onChange={this.handleChange} />' +
        '<input type="submit" value="Delete" className="btn btn-danger" />' +
        '</form>'+'</pre>';
    }
    return output;
  }

  function genJsonObjectOutput(response) {
    var output = '';
    var id = response.data.id.toString();
      output = '<pre>' + '<span>' + id + '</span>' + '<br>' +
        '<span>' + response.data.name + '</span>' + '<br>' +
        '<span>' + response.data.url + '</span>' + '<br>' +
        '<object style="width: 420px; height: 315px; float: none; clear: both; margin: 2px auto;" data="' + response.data.url + '"></object>' +
        '<form onSubmit={e => this.request(e, "delete")}>' +
        '<input type="hidden" name="id" value="' + id + '" onChange={this.handleChange} />' +
        '<input type="submit" value="Delete" className="btn btn-danger" />' +
        '</form>'+'</pre>';
    return output;
  }
  
  function genErrorOutput(error) {
    return  '<h4>Result</h4>' + 
            '<h5>Message:</h5> ' + 
            '<pre>' + error.message + '</pre>' +
            '<h5>Status:</h5> ' + 
            '<pre>' + error.response.status + ' ' + error.response.statusText + '</pre>' +
            '<h5>Data:</h5>' + 
            '<pre>' + JSON.stringify(error.response.data, null, '\t') + '</pre>'; 
  }


serviceWorker.register();

