

import "DecayingTokenBoundaryRange.sol";


contract TimeDecayingTokenBoundaryRange is DecayingTokenBoundaryRange {

    uint256 internal _startDate;
    uint256 internal _endDate;


    function(){
	throw;
    }

    
    function TimeDecayingTokenBoundaryRange(
	uint256 startDate, 
	uint256 endDate, 
	uint256 startPercent, 
	uint256 endPercent, 
	DecayingTokenFunction tokenFunction){
	
	if(startDate >= endDate){ throw; }
	if(startPercent < endPercent){ throw; }
	
	_startDate = startDate;
	_endDate = endDate;
	_startingPercent = startPercent;
	_endingPercent = endPercent;
	_tokenFunction = tokenFunction;    
    }

    
    function calculateRangeLength() constant public returns (uint256 rangeLength){
	return 0;
    }
    
    
    function calculateCurrentDistanceInRange(DecayingTokenEnvironment environment) constant public returns (uint256 distanceInRange){
	return 0;
    }
    

}