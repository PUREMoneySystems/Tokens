
import "DecayingToken.sol";
import "TimeDecayingTokenBoundary.sol";


contract TimeDecayingToken is DecayingToken {

    function(){
	throw;
    }
    
    function TimeDecayingToken(TimeDecayingTokenBoundary tokenBoundary, uint256 initialAmount){
	addBoundary(tokenBoundary);
    }
}

