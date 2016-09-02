

contract DecayingTokenFunction {
    
    enum TokenFunctionType { Sudden, Linear, StairStep, Exponential, Custom }
                  
    function getFunctionType() constant external returns (uint8 functionType);
        
    function executeDecayFunction(uint256 _amount, uint256 _rangeLength, uint256 _distanceInRange, uint256 _startPercent, uint256 _endPercent) public returns (uint256 decayedAmount);
    
    
    
}
