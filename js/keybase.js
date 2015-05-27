exports.lookup = function (data, callback) {
  $.get('https://keybase.io/_/api/1.0/user/lookup.json', data, callback);
};

exports.lookupPubKey = function (data) {
  var pubKey = null;
  this.lookup(data, function(d) {
    if (d.them.length > 0) {
      pubKey = d.them[0].public_keys.bundle;
    }
  });
  return pubKey;
};