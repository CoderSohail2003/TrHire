const { app } = require('../server/app');

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');
  const apiPath = requestUrl.searchParams.get('path');

  if (apiPath) {
    requestUrl.searchParams.delete('path');
    const remainingQuery = requestUrl.searchParams.toString();
    req.url = `/api/${apiPath}${remainingQuery ? `?${remainingQuery}` : ''}`;
  } else {
    req.url = '/api';
  }

  return app(req, res);
};
