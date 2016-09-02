import "DecayingTokenFunction.sol";

contract ExponentialDecayingTokenFunction is DecayingTokenFunction {


    function(){
	    throw;
    }
    
    
    function ExponentialDecayingTokenFunction(){
    }


    function getFunctionType() constant external returns (uint8 functionType){
	return uint8(TokenFunctionType.Exponential);
    }
    
    
    function executeDecayFunction(uint256 _amount, uint256 _rangeLength, uint256 _distanceInRange, uint256 _startPercent, uint256 _endPercent) public returns (uint256 decayedAmount){
        return 1111111;
    } 
    
}