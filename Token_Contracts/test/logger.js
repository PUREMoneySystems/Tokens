contract("Logger", function(accounts) {



    it("creation: event test (fail)", function(done) {
	var logger = Logger.deployed();
	logger.fireEvent().then(function(){
	  assert.isTrue(false);
	}).then(done).catch(done);
    });
    
    it("creation: event test", function(done) {
	var logger = Logger.deployed();
	logger.fireEvent().then(function(){
	  done();
	}).catch(done);
    });
    
    it("creation: event test (again)", function(done) {
	var logger = Logger.deployed();
	logger.fireEvent().then(function(){
	  done();
	}).catch(done);
    });    
    
    it("creation: event test (promises...)", function(done) {
	var logger = Logger.deployed();
	var events = logger.WriteValueToLog();
	
	logger.fireEvent().then(new Promise(function(resolve, reject){
	  events.watch(function(error, log){ resolve(log, done); });
	}).then(function(log, done){
	  console.log(log.event + "(" + log.args['message'] + ")");
	  assert.isTrue(true);
	  events.stopWatching();
	}).then(done).catch(done));
    });
    
    
    
});