const GET = require('./common/docker-get');

const buildPath = function (msg) {
  const image = msg.payload.image;

  if ((typeof image !== 'string') || image === '') {
    node.error("'image' needs to be specified using 'msg' or 'config'");
    return;
  }

  return `/image/${image}/json`;
}

const onData = function () {
  const result = function (chunk) {
    if ((typeof chunk === 'string') && chunk !== '') {
      node.trace(chunk);
      
      result.accumulator += chunk
    }
    return result.accumulator;
  };

  result.accumulator = "";

  return result;
};

const onSuccess = function (msg, node, data) {
  const payload = Object.assign({}, msg.payload);
  payload.image_info = JSON.parse(data);
  payload.time = new Date();

  node.send({
    _msgid: msg._msgid,
    payload: payload
  });
};

const onFailure = function (msg, node, data) {
  node.error(data);
};

module.exports = GET('inspect-image', buildPath, onData, onSuccess, onFailure);