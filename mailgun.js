var axios = require('axios'),
    Promise = require('bluebird'),
    qs = require('qs');

var apiUrl = function(url) {
  return 'https://api.mailgun.net/v2' + url;
};

var authStr = function(user, pass) {
  return new Buffer(user + ':' + pass).toString('base64');
};

function Mailgun(apiKey) {
  this.apiKey = apiKey;
}

Mailgun.prototype.mailingList = function(list) {
  return new MailingList(list, this);
};

Mailgun.prototype.post = function(url, params) {
  return Promise.resolve(axios.post(apiUrl(url), qs.stringify(params), {
    headers: {
      'Authorization': 'Basic ' + authStr('api', this.apiKey)
    }
  }).catch(function(resp) {
    throw new Error('Mailgun request failed: ' + JSON.stringify(resp));
  }));
};

function MailingList(list, client) {
  this.list = list;
  this.client = client;
};

MailingList.prototype.addMember = function(params) {
  return this.client.post('/lists/' + this.list + '/members', params).then(function(resp) {
    return resp.data;
  });
};

module.exports = function(apiKey) {
  return new Mailgun(apiKey);
};
