
import "DecayingTokenBoundary.sol";
import "TimeDecayingTokenEnvironment.sol";


contract TimeDecayingTokenBoundary is DecayingTokenBoundary {


    function(){
	throw;
    }

    
    function TimeDecayingTokenBoundary(
	uint256 startDate, 
	uint256 endDate, 
	uint256 startPercent, 
	uint256 endPercent, 
	DecayingTokenFunction tokenFunction){
	
	
	
    
    }
    
    function findActiveRange(DecayingTokenEnvironment environment) constant public returns (DecayingTokenBoundaryRange range, bool cannotFindActiveRange){
	TimeDecayingTokenEnvironment timeEnvironment = TimeDecayingTokenEnvironment(environment);
    
    }



}
