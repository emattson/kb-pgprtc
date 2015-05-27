var kbpgp = require('kbpgp');
var me = null;
var peers = [];

var ring = new kbpgp.keyring.KeyRing();

var my_asp = new kbpgp.ASP({
  progress_hook: function (o) {
    console.log("Progress is being made: ", o);
  }
});

exports.me = me;
exports.peers = peers;

exports.generateKey = function (userid, callback) {
  var params = {
    asp: my_asp,
    userid: userid
  };

  kbpgp.KeyManager.generate_ecc(params, function (err, peer) {
    if (err != null) {
      console.log('Problem: ', err);
    } else {
      // sign peer's subkeys
      peer.sign({}, function (err) {
        if (!err) {
          me = peer;
          ring.add_key_manager(peer);
          callback(peer);
        }
      });
    }
  });
};

exports.registerFromPublicKey = function (name, publickey, callback) {
  var params = {
    armored: publickey
  };

  kbpgp.KeyManager.import_from_armored_pgp(params, function (err, peer) {
    if (err != null) {
      console.log('Problem: ', err);
    } else {
      peer.name = name;
      console.log(name, 'is loaded as', peer);
      peers[name] = peer;
      ring.add_key_manager(peer);
      callback(peer);
    }
  });
};

exports.encryptAndSign = function (name, raw, channel, callback) {
  var params = {
    msg: raw,
    encrypt_for: peers[name],
    sign_with: me
  };

  kbpgp.box(params, function (err, result_string, result_buffer) {
    //console.log(err, result_string, result_buffer);
    if (!err) {
      callback(channel, result_string);
    }
  });
};

exports.decryptAndVerify = function (name, raw, callback) {
  var params = {
    keyfetch: ring,
    armored: raw,
    asp: my_asp
  };

  kbpgp.unbox(params, function (err, literals) {
    if (err != null) {
      return console.log('Problem: ', err);
    } else {
      var decrypted = literals[0].toString();
      console.log('decrypted message: ' + decrypted);
      var ds = km = null;
      ds = literals[0].get_data_signer();
      if (ds) {
        km = ds.get_key_manager();
      }
      if (km) {
        console.log('Signed by PGP fingerprint: ', km.get_pgp_fingerprint().toString('hex'), 'sender\'s name is: ', km.name);
        if (name === km.name) {
          callback(decrypted);
        } else {
          return console.log('Message was not signed, dropping it');
        }
      }
    }
  });
};

exports.sign = function (message, callback) {
  var params = {
    msg: message,
    sign_with: me
  };

  kbpgp.box(params, function (err, result_string, result_buffer) {
    //console.log(err, result_string, result_buffer);
    if (err != null) {
      return console.log('Problem: ', err);
    } else {
      console.log('signed message with personal key');
      callback(result_string);
    }
  });
};

exports.verify = function (name, message, callback) {
  var params = {
    keyfetch: ring,
    armored: message,
    asp: my_asp
  }

  kbpgp.unbox(params, function (err, literals) {
    if (err != null) {
      console.log('Problem verifying: ', err);
    } else {
      var ds = km = null;
      ds = literals[0].get_data_signer();
      if (ds) {
        km = ds.get_key_manager();
      }
      if (km) {
        console.log('Signed by PGP fingerprint: ', km.get_pgp_fingerprint().toString('hex'), 'sender\'s name is: ', km.name);
        if (name === km.name) {
          callback(true, literals[0].toString());
        } else {
          callback(false, literals[0].toString());
        }
      }
    }
  });
};
