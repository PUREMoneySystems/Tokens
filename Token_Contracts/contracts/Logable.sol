
import "Logger.sol";


contract Logable {


    address public loggerAddress;
    Logger internal logger;
    bool internal loggerSet = false;
    
    function setLogger(address _logger) public returns (bool success){
      loggerAddress = _logger;
      logger = Logger(_logger);      
      loggerSet = true;
      return loggerSet;
    }    
    
    function logMessage(string message) public returns (bool success){
      logger.logValue(message, true);
    }
    
    function logMessage(string message, bool boolValue) public returns (bool success){
      logger.logValue(message, boolValue);
    }
    
    function logMessage(string message, uint256 uintValue) public returns (bool success){
      logger.logValue(message, uintValue);
    }


}