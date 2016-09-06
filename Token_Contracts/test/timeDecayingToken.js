contract("TimeDecayingToken", function(accounts) {

  
    var tokenName = 'TEST Dollars';
    var tokenSymbol = 'TSD';
    var displayDecimals = 2; 
    var startDate = Number((new Date()).getTime());
    var endDate = Number(startDate + (60000)); //60 seconds from now
    var startPercent = 100;
    var endPercent = 0;
    var startingBalance = 10000; 
    
    /*
     *  CODE FOR SETTING UP LOG FILTERS FOR EVENTS		
	var logger = Logger.deployed();
	var events = logger.allEvents();
	var listener = new Promise(function(resolve, reject){
			  events.watch(function(error, log){ 	
			    var argName = (log['event'] == "WriteMessageToLog") ? "message" : "value";
			    console.log(log['event'] + "(" + log['args'][argName] + ")");
			  });
			  setTimeout(function(){
			    resolve(done);
			    events.stopWatching();}, 5000);
			});		
     */
  
  
  
  
  
  
  
//CREATION
     
    it("creation: should create an initial balance of 10000 for the creator", function(done) {		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(token){
		return token.balanceOf.call(accounts[0]);
	    }).then(function(result){
		assert.strictEqual(result.toNumber(), 10000);
		done();
	    }).catch(done);
	  });
	});
    });
   		    
	
    it("creation: should correctly set vanity information", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      return token.name.call();
	    }).then(function (retrievedTokenName) {
	      assert.strictEqual(retrievedTokenName, tokenName);
	      return token.decimals.call();
	    }).then(function (retreivedDisplayDecimals) {
	      assert.strictEqual(retreivedDisplayDecimals.toNumber(), displayDecimals);
	      return token.symbol.call();
	    }).then(function(retrievedTokenSymbol) {
	      assert.strictEqual(retrievedTokenSymbol, tokenSymbol);
	      done();
	    }).catch(done);
	  });
	});
    });
    
   
    it("creation: should succeed in creating over 2^256 - 1 (max) tokens", function(done){
	var maxStartingBalance = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){		
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]} ).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, maxStartingBalance, tokenName, displayDecimals, tokenSymbol,  {from: accounts[0]}).then(function(newToken){
	      return newToken.totalSupply();
	    }).then(function (result) {
	      var match = result.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77');
	      assert.isTrue(match);
	      done();
	    }).catch(done);
	  });
	});
    });
   		    
	
    it("creation: should create a token and all components for calculating decayed balances", function(done) {	
	LinearDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    var currentTime = Number((new Date()).getTime());
	    TimeDecayingTokenEnvironment.new(currentTime, {from: accounts[0]}).then(function(environment){
	      TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]}).then(function(newToken){	      
		newToken.decayedBalanceOf.call(environment.address, {from: accounts[0]}).then(function(decayedBalance){
		  var newCurrentTime = (Number((new Date()).getTime()) + 5);
		  TimeDecayingTokenEnvironment.new(newCurrentTime, {from: accounts[0]}).then(function(newEnvironment){
		    newToken.decayedBalanceOf.call(newEnvironment.address, {from: accounts[0]}).then(function(updatedDecayedBalance){
		      assert.isAbove(decayedBalance.valueOf(), updatedDecayedBalance.valueOf());
		      done();
		    }).catch(done);
		  });
		});
	      });
	    });
	  });
	});
    });

    
 
    
    
    
    
//TRANSERS

    //this is not *good* enough as the contract could still throw an error otherwise.
    //ideally one should check balances before and after, but estimateGas currently always throws an error.
    //it's not giving estimate on gas used in the event of an error.
    it("transfers: should attempt, then reverse ether transfer sent directly to the contract", function(done) {		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){	      
	      return web3.eth.sendTransaction({from: accounts[0], to: ctr.address, value: web3.toWei("10", "Ether")});
	    }).catch(function(result) {
	      done();
	    }).catch(done);
	  });
	});
    });

    it("transfers: should transfer 10000 to accounts[1] from accounts[0], which had 10000", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
		      
	      return token.transfer(accounts[1], 10000, {from: accounts[0]});
	    }).then(function (result) {
		return token.balanceOf.call(accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 10000);
		done();
	    }).catch(done);
	  });
	});
    });
    
    it("transfers: should transfer enough decayed tokens to equal 2000 whole tokens (sends more than 2000 tokens)", function(done) {
	var token;
	var newStartDate = Number((new Date()).getTime());
	var newEndDate = Number(newStartDate + (60000)); //30 seconds from now
		
	LinearDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(newStartDate, newEndDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    var currentTime = Number((new Date()).getTime());
	    TimeDecayingTokenEnvironment.new(currentTime, {from: accounts[0]}).then(function(environment){
	      TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
		newToken.decayedTransfer.call(accounts[1], 2000, environment.address, {from: accounts[0]}).then(function(result){		
		  
		  newToken.balanceOf.call(accounts[0], {from:accounts[0]}).then(function(originBalance){
		    assert.isBelow(originBalance.valueOf(), startingBalance-2000);
		  });
		  
		  newToken.balanceOf.call(accounts[1], {from:accounts[1]}).then(function(destinationBalance){
		    assert.isAbove(destinationBalance.valueOf(), 2000);
		  });
		  
		  newToken.decayedBalanceOf.call(accounts[1], environment.address, {from: accounts[0]}).then(function(destDecayedBalance){
		    assert.approximately(destDecayedBalance.valueOf(), 2000, 5);
		  });
		  
		  done();
		}).catch(done);
	      });
	    });
	  });
	});
    });

    it("transfers: should fail when trying to transfer 10001 to accounts[1] with accounts[0] having 10000", function(done) {		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      return newToken.transfer.call(accounts[1], startingBalance+1, {from: accounts[0]});
	    }).then(function (result) {
		assert.isFalse(result);
		done();
	    }).catch(done);
	  });
	});
    });

    it("transfers: should fail when trying to transfer zero.", function(done) {		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){	      
	      return newToken.transfer.call(accounts[1], 0, {from: accounts[0]});
	    }).then(function (result) {
		assert.isFalse(result);
		done();
	    }).catch(done);
	  });
	});
    });

    
    
    
    
    
    
//APPROVALS

    it("approvals: should allow msg.sender to approve accounts[1] to transfer up to 100 tokens", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      
	      return token.approve(accounts[1], 100, {from: accounts[0]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 100);
		done();
	    }).catch(done);
	  });
	});
    });

    
    /*
    it("approvals: msg.sender should approve 100 to SampleRecipient and then NOTIFY SampleRecipient. It should succeed.", function(done) {
        var ctr = null;
        var sampleCtr = null
        HumanStandardToken.new(10000, 'Simon Bucks', 1, 'SBX', {from: accounts[0]}).then(function(result) {
            ctr = result;
            return SampleRecipientSuccess.new({from: accounts[0]});
        }).then(function(result) {
            sampleCtr = result;
            return ctr.approveAndCall(sampleCtr.address, 100, '0x42', {from: accounts[0]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], sampleCtr.address);
        }).then(function (result) {
            assert.strictEqual(result.toNumber(), 100);
            return sampleCtr.value.call();
        }).then(function (result) {
            assert.strictEqual(result.toNumber(), 100);
            done();
        }).catch(done);
    });

    it("approvals: msg.sender should approve 100 to SampleRecipient and then NOTIFY SampleRecipient and throw.", function(done) {
        var ctr = null;
        var sampleCtr = null
        HumanStandardToken.new(10000, 'Simon Bucks', 1, 'SBX', {from: accounts[0]}).then(function(result) {
            ctr = result;
            return SampleRecipientThrow.new({from: accounts[0]});
        }).then(function(result) {
            sampleCtr = result;
            return ctr.approveAndCall.call(sampleCtr.address, 100, '0x42', {from: accounts[0]});
        }).catch(function (result) {
            //It will catch OOG.
            done();
        }).catch(done)
    });
    */

    //Includes an attempt to transferFrom using direct method invocation and call proxy invocation (only one succeeds)
    it("approvals: should allow msg.sender to approve accounts[1] for 100 & transfers 20 once.", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      
	      return token.balanceOf.call(accounts[0]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 10000);
		return token.approve(accounts[1], 100, {from: accounts[0]});
	    }).then(function (result) {
		return token.balanceOf.call(accounts[2]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 0);
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 100);
		return token.transferFrom.call(accounts[0], accounts[2], 20, {from: accounts[1]});
	    }).then(function (result) {
		return token.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 80);
		return token.balanceOf.call(accounts[2]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 20);
		return token.balanceOf.call(accounts[0]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 9980);
		done();
	    }).catch(done);
	  });
	});
    });

    it("approvals: should allow msg.sender to approve accounts[1] of 100 & transfers 20 twice.", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      
	      return token.approve(accounts[1], 100, {from: accounts[0]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 100);
		return token.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 80);
		return token.balanceOf.call(accounts[2]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 20);
		return token.balanceOf.call(accounts[0]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 9980);
		//FIRST tx done.
		//onto next.
		return token.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 60);
		return token.balanceOf.call(accounts[2]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 40);
		return token.balanceOf.call(accounts[0]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 9960);
		done();
	    }).catch(done);
	  });
	});
    });

    it("approvals: should fail when msg.sender approves accounts[1] of 100 & then transfers 50 & 60 ", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      
	      return token.approve(accounts[1], 100, {from: accounts[0]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 100);
		return token.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]});
	    }).then(function (result) {
		return token.allowance.call(accounts[0], accounts[1]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 50);
		return token.balanceOf.call(accounts[2]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 50);
		return token.balanceOf.call(accounts[0]);
	    }).then(function (result) {
		assert.strictEqual(result.toNumber(), 9950);
		//FIRST tx done.
		//onto next.
		return token.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
	    }).then(function (result) {
		assert.isFalse(result);
		done();
	    }).catch(done);
	  });
	});
    });

    it("approvals: should fail when attempting to withdrawal from account with no allowance", function(done) {		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){	      
	      return newToken.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
	    }).then(function (result) {
		assert.isFalse(result);
		done();
	    }).catch(done);
	  });
	});
    });

    it("approvals: should fail when approving accounts[1] for a 100 withdraw limit from accounts[0], transferring 60, changing limit to 0 & attempting a subsequent transfer.", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      
	      return token.approve(accounts[1], 100, {from: accounts[0]});
	    }).then(function (result) {
		return token.transferFrom(accounts[0], accounts[2], 60, {from: accounts[1]});
	    }).then(function (result) {
		return token.approve(accounts[1], 0, {from: accounts[0]});
	    }).then(function (result) {
		return token.transferFrom.call(accounts[0], accounts[2], 10, {from: accounts[1]});
	    }).then(function (result) {
		  assert.isFalse(result);
		  done();
	    }).catch(done);
	  });
	});
    });

    it("approvals: should successfully approve max (2^256 - 1)", function(done) {
	var token;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){	
	  TimeDecayingTokenBoundary.new(startDate, endDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
	      token = newToken;
	      
	      return token.approve(accounts[1],'115792089237316195423570985008687907853269984665640564039457584007913129639935' , {from: accounts[0]});
	    }).then(function (result) {
		return token.allowance(accounts[0], accounts[1]);
	    }).then(function (result) {
		var match = result.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77');
		assert.isTrue(match);
		done();
	    }).catch(done);
	  });
	});
    });

    

//DECAYING BEHAVIORS
    
    it("decay: should start with a balance of 10000 and decay linearly to 0% over 5 seconds", function(done) {
	var newStartDate = Number((new Date()).getTime());
	var newEndDate = Number(newStartDate + (5000)); //5 seconds from now
		
	LinearDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(newStartDate, newEndDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    var currentTime = Number((new Date()).getTime());
	    TimeDecayingTokenEnvironment.new(currentTime, {from: accounts[0]}).then(function(environment){
	      TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
		  		  
		newToken.decayedBalanceOf.call(environment.address, {from: accounts[0]}).then(function(decayedBalance){	    
		  var rangeLength = (newEndDate - newStartDate);
		  var distanceInRange = (currentTime - newStartDate);
		  var estimatedDecayedBalance = ((startPercent - ((startPercent - endPercent) * (distanceInRange / rangeLength))) * startingBalance) / 100;
		  
		  assert.approximately(decayedBalance.toNumber(), estimatedDecayedBalance, 1);
		  done();
		}).catch(done);
		  
	      });
	    });
	  });
	});	
    });

    it("decay: should start with a balance of 10000 and decay to 50% suddenly after 1 second", function(done) {	
	var newStartDate = Number((new Date()).getTime());
	var newEndDate = Number(newStartDate + (1000)); //1 second from now
	var newEndPercent = 50;
		
	SuddenDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(newStartDate, newEndDate, startPercent, newEndPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    var currentTime = Number((new Date()).getTime());
	    TimeDecayingTokenEnvironment.new(currentTime, {from: accounts[0]}).then(function(environment){
	      TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
		  		  
		newToken.decayedBalanceOf.call(environment.address, {from: accounts[0]}).then(function(decayedBalance){		  
		  assert.strictEqual(decayedBalance.toNumber(), (startingBalance * 0.5));
		  done();
		}).catch(done);
		  
	      });
	    });
	  });
	});	
    });
        
    it("decay: should start with a balance of 10000 and decay exponentially to 0% over 5 seconds", function(done) {	
	var newStartDate = Number((new Date()).getTime());
	var newEndDate = Number(newStartDate + (5000)); //5 seconds from now
		
	ExponentialDecayingTokenFunction.new({from:accounts[0]}).then(function(tokenFunction){
	  TimeDecayingTokenBoundary.new(newStartDate, newEndDate, startPercent, endPercent, tokenFunction.address, {from: accounts[0]}).then(function(boundary){
	    var currentTime = Number((new Date()).getTime());
	    TimeDecayingTokenEnvironment.new(currentTime, {from: accounts[0]}).then(function(environment){
	      TimeDecayingToken.new(boundary.address, startingBalance, tokenName, displayDecimals, tokenSymbol, {from: accounts[0]} ).then(function(newToken){
		  		  
		newToken.decayedBalanceOf.call(environment.address, {from: accounts[0]}).then(function(decayedBalance){	    
		  var rangeLength = (newEndDate - newStartDate);
		  var distanceInRange = (currentTime - newStartDate);
		  
		  //y = yMAX - (((yMAX ^ (x / xMAX)) * (startPercent - endPercent)) / 100)
		  
		  var estimatedDecayedBalance = startingBalance - ((Math.pow(startingBalance, (distanceInRange / rangeLength)) * (startPercent - endPercent)) / 100);
		  
		  assert.approximately(decayedBalance.toNumber(), estimatedDecayedBalance, 10);
		  done();
		}).catch(done);
		  
	      });
	    });
	  });
	});	
    });

    /*
    it("decay: should start with a balance of 10000 and decay stairstep 10%/1secs over 10 seconds", function(done) {		
	SuddenDecayingTokenFunction.new({from: accounts[0]}).then(function(tokenFunction){	
	    done();
	}).catch(done);
    });

    it("decay: should start with a balance of 10000, decay linearly to 50% over 5secs, then suddenly to 0% over 5secs", function(done) {		
	SuddenDecayingTokenFunction.new({from: accounts[0]}).then(function(tokenFunction){	
	    done();
	}).catch(done);
    });
    
    */

});
