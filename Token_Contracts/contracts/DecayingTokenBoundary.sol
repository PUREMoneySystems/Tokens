
import "DecayingTokenEnvironment.sol";
import "DecayingTokenBoundaryRange.sol";


contract DecayingTokenBoundary {


    function findActiveRange(DecayingTokenEnvironment environment) constant public returns (DecayingTokenBoundaryRange range, bool cannotFindActiveRange);

    function addRange(DecayingTokenBoundaryRange range) returns (uint256 rangeIndex){
	uint256 newRangeIndex = ranges.length;
	ranges[newRangeIndex] = range;
	return newRangeIndex;
    }
    
    function removeRange(uint8 rangeIndex) returns (bool success){
	if(ranges.length > rangeIndex && 0 <= rangeIndex){
	    for(uint256 i = rangeIndex; i < ranges.length - 1; i++){
		ranges[i] = ranges[i+1];
	    }
	    delete ranges[ranges.length-1];
	    ranges.length--;
	    
	    return true;
	}else{
	    return false;
	}   
    }    


    DecayingTokenBoundaryRange[] ranges;
}
