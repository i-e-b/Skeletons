var os = require('os'),
	version = require('../../package.json').version,
	format = require('util').format;

module.exports = function(req, res){
	var now = new Date();
	res.send({
		Message: format("Service version %s is alive at %s", version, now),
		ServerTime: now,
		MachineName: os.hostname(),
		AssemblyVersion: version
	});
}