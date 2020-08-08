"use strict";
const Link       = require("./Link");
const {reasons}  = require("./messages");
const requestUrl = require("./requestUrl");

const promiseTry = require("es6-promise-try");


function checkHttp(link, auth, cache, options)
{
  const request = requestUrl(link.url.rebased, auth, options.requestMethod, options).then(({response}) => {
    cache.set(response.url, response);
    response.redirects.forEach(redirect => {
      cache.set(redirect.url, redirect);
    });
    return response;
  }).catch(error => error);

  return request;
}

function checkLink(link, auth, cache, options) {
  return promiseTry(() => {

    let cachePromise = cache.get(link.url.rebased);
    return Promise.resolve(cachePromise).then((value) => {
      if(value === null) {
        let reqHttp = checkHttp(link, auth, cache, options);
        return reqHttp.then(response => {
          copyResponseData(response, link, options);
          link.http.cached = false;
          return link;
        });
      }
      else {
        return Promise.resolve(value).then(response => {
          copyResponseData(JSON.parse(response), link, options);
          link.http.cached = true;
          return link;
        });
      }
    })
  });
}


/*
  Copy data from a `simpleResponse` object—either from a request or cache—
  into a link object.
  */
function copyResponseData(response, link, options)
{
  if (!(response instanceof Error)) {
    if(response.status>300 && response.status < 399 && response.headers.location) {
      Link.redirect(link, response.headers.location);
    }
    else if (response.status<200 || response.status>299) {
      link.broken = true;

      if (`HTTP_${response.status}` in reasons) {
        link.brokenReason = `HTTP_${response.status}`;
      }
    }
    else {
      link.broken = false;
    }
    link.http.response = response;
  }
  else {
    link.broken = true;

    if (`ERRNO_${response.code}` in reasons) {
      link.brokenReason = `ERRNO_${response.code}`;
    }
  }

  if (link.broken && link.brokenReason == null) {
    link.brokenReason = "BLC_UNKNOWN";
  }
}

module.exports = checkLink;
