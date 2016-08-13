import "DecayingTokenFunction.sol";

contract StairStepDecayingTokenFunction is DecayingTokenFunction {


    function(){
	    throw;
    }
    
    
    function StairStepDecayingTokenFunction(){}
    
    
    function executeDecayFunction(uint256 amount, uint256 rangeLength, uint256 distanceInRange, uint256 startPercent, uint256 endPercent) constant public returns (uint256 decayedAmount){
        
    }  
    
}