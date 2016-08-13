
import "StandardToken.sol";
import "DecayingTokenFunction.sol";
import "DecayingTokenBoundary.sol";
import "DecayingTokenEnvironment.sol";


contract DecayingToken is StandardToken {


    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show. 
    string public symbol;                 //An identifier: eg SBX
    string public version = 'D0.1';       //decay 0.1 standard. Just an arbitrary versioning scheme.

    
    function addBoundary(DecayingTokenBoundary newBoundary) returns (uint256 decayBoundaryIndex){
	uint256 boundaryIndex = boundaries.length;
	boundaries[boundaryIndex] = newBoundary;	
	return boundaryIndex;
    }
    
    function removeBoundary(uint256 decayDefinitionIndex) returns (bool success){
	if(boundaries.length > decayDefinitionIndex && 0 <= decayDefinitionIndex){
	    for(uint256 i = decayDefinitionIndex; i < boundaries.length - 1; i++){
		boundaries[i] = boundaries[i+1];
	    }
	    delete boundaries[boundaries.length-1];
	    boundaries.length--;
	    
	    return true;
	}else{
	    return false;
	}    
    }
    
    function decayedBalanceOf(address _owner, DecayingTokenEnvironment environment) constant public returns (uint256 decayedBalance){
	uint256 returnBalance = balanceOf(msg.sender);
	
	for(uint256 i = 0; i < boundaries.length; i++){
	    var (range, cannotFindActiveRange) = boundaries[i].findActiveRange(environment);
	    if(cannotFindActiveRange){
		    continue;
	    }
	    
	    returnBalance = range.calculateDecayedBalance(returnBalance, environment);
	}
	    
	return returnBalance;	
    }
    
    
    
    
    
    DecayingTokenBoundary[] boundaries;
}





