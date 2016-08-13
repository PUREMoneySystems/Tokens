
import "DecayingTokenFunction.sol";
import "DecayingTokenEnvironment.sol";



contract DecayingTokenBoundaryRange {

    uint256 internal _startingPercent;
    uint256 internal _endingPercent;
    DecayingTokenFunction internal _tokenFunction;
    
    
    function calculateDecayedBalance(uint256 balance, DecayingTokenEnvironment tokenEnvironment) constant public returns (uint256 decayedBalance){
	uint256 rangeLength = calculateRangeLength();
	uint256 distanceInRange = calculateCurrentDistanceInRange(tokenEnvironment);
	
	uint256 returnBalance = _tokenFunction.executeDecayFunction(balance, rangeLength, distanceInRange, _startingPercent, _endingPercent);
    
	return returnBalance;
    }
    
    
    function calculateRangeLength() constant public returns (uint256 rangeLength);
    
    function calculateCurrentDistanceInRange(DecayingTokenEnvironment environment) constant public returns (uint256 distanceInRange);
    
}