
import "TokenFactory.sol";
import "Token.sol";

contract StandardTokenFactory is TokenFactory {

    bool internal _useRegistry = false;
    address internal _registry;
    address internal _DEFAULT_REGISTRY;
    
    
    event TokenRegistryChanged(address currentRegistry, bool registryUseON);
    
    
    
    function useDefaultRegistry() internal returns (bool usingDefaultRegistrySuccess){
        if(setUseRegistry(true)){
            if(setRegistry(_DEFAULT_REGISTRY)){
                //Successfully set the token registry to the default
                TokenRegistryChanged(getRegistry(), getUseRegistry());
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    function getUseRegistry() constant public returns (bool){
	    return _useRegistry;
    }
    function setUseRegistry(bool useRegistry) internal returns (bool registrySetSuccess){
	    _useRegistry = useRegistry;
	    return true;
    }
    function setRegistry(address newRegistryAddress) public returns (bool registrationSuccess){
        if(setUseRegistry(true)){
            _registry = newRegistryAddress;
            return true;
        }else{
            return false;
        }
    }
    function getRegistry() constant public returns (address registry){
	    return _registry;
    }
    
    function registerNewToken(Token newToken) returns (bool){
        
    }
    
    function deregisterToken(Token token) returns (bool){
        
    }



}