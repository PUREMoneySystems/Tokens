
import "StandardTokenFactory.sol";
import "DecayingTokenFunction.sol";
import "SuddenDecayingTokenFunction.sol";
import "LinearDecayingTokenFunction.sol";
import "StairStepDecayingTokenFunction.sol";
import "ExponentialDecayingTokenFunction.sol";


contract DecayingTokenFactory is StandardTokenFactory {

  enum TokenFunctionType { Sudden, Linear, StairStep, Exponential, Custom }
  
  
  function createTokenFunction(TokenFunctionType functionType) constant public returns (DecayingTokenFunction tokenFunction){
      DecayingTokenFunction returnTokenFunction;
      
      if(functionType == TokenFunctionType.Sudden){
	  returnTokenFunction = new SuddenDecayingTokenFunction();
      }else{
	  if(functionType == TokenFunctionType.Linear){
	      returnTokenFunction = new LinearDecayingTokenFunction();
	  }else{
	      if(functionType == TokenFunctionType.StairStep){
		  returnTokenFunction = new StairStepDecayingTokenFunction();
	      }else{
		  if(functionType == TokenFunctionType.Exponential){
		      returnTokenFunction = new ExponentialDecayingTokenFunction();
		  }else{
		      if(functionType == TokenFunctionType.Custom){
			  returnTokenFunction = new LinearDecayingTokenFunction();
		      }else{
			  throw;
		      }
		  }
	      }	  
	  }      
      }
      
      return returnTokenFunction;
  }
    

}