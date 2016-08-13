

import "DecayingTokenFactory.sol";
import "DecayingTokenFunction.sol";
import "TimeDecayingToken.sol";
import "TimeDecayingTokenBoundary.sol";
import "TimeDecayingTokenBoundaryRange.sol";

 
contract TimeDecayingTokenFactory is DecayingTokenFactory {


    function (){
	throw;
    }
    
    
    function TimeDecayingTokenFactory(bool useTheDefaultRegistry){    
	if(useTheDefaultRegistry){
	  useDefaultRegistry();
	}
    }


    function createTimeDecayingToken(
	uint256 startDate, 
	uint256 endDate, 
	uint256 startPercent, 
	uint256 endPercent, 
	uint256 initialAmount, 
	TokenFunctionType functionType) returns (TimeDecayingToken newTimeDecayingToken){
	
	DecayingTokenFunction tokenFunction = createTokenFunction(functionType);
	TimeDecayingTokenBoundary tokenBoundary = new TimeDecayingTokenBoundary(startDate, endDate, startPercent, endPercent, tokenFunction);
	newTimeDecayingToken = new TimeDecayingToken(tokenBoundary, initialAmount);
	return newTimeDecayingToken;    
    }

}