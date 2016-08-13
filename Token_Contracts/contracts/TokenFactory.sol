import "StandardToken.sol";

contract TokenFactory {

    event TokenRegistryChanged(address currentRegistry, bool registryUseON);     
    
    function useDefaultRegistry() internal returns (bool usingDefaultRegistrySuccess);
    
    function getUseRegistry() constant public returns (bool);
    function setUseRegistry(bool useRegistry) internal returns (bool registrySetSuccess);
    function setRegistry(address newRegistryAddress) public returns (bool registrationSuccess);
    function getRegistry() constant public returns (address registry);
    
    function registerNewToken(Token newToken) returns (bool);
    
    function deregisterToken(Token token) returns (bool);

}