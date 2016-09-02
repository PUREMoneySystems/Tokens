

contract Logger{

  event WriteMessageToLog(string message);
  event WriteBytesToLog(bytes32 value);
  event WriteUintToLog(uint value);
  event WriteAddressToLog(address value);

  function logValue(string source, bytes32 value) public returns (bool success){
    WriteMessageToLog(source);
    WriteBytesToLog(value);
    return true;
  }
  
  function logValue(string source, uint value) public returns (bool success){
    WriteMessageToLog(source);
    WriteUintToLog(value);
    return true;
  }
  
  function logValue(string source, bool value) public returns (bool success){
    WriteMessageToLog(source);
    WriteMessageToLog((value)?"true":"false");
    return true;
  }
  
  function logValue(string source, address value) public returns (bool success){
    WriteMessageToLog(source);
    WriteAddressToLog(value);
    return true;
  }
  
  function fireEvent(){
    WriteMessageToLog("big test");
  }

  function uintToBytes(uint v) constant returns (bytes32 ret) {
      if (v == 0) {
	  ret = '0';
      }else {
	  while (v > 0) {
	      ret = bytes32(uint(ret) / (2 ** 8));
	      ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
	      v /= 10;
	  }
      }
      return ret;
  }
  

}