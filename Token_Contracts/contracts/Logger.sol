

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
  
  function bytes32ToString (bytes32 data) returns (string) {
        bytes memory bytesString = new bytes(32);
        for (uint j=0; j<32; j++) {
            byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[j] = char;
            }
        }
        return string(bytesString);
    }

    function bytes32ArrayToString (bytes32[] data) returns (string) {
        bytes memory bytesString = new bytes(data.length * 32);
        uint urlLength;
        for (uint i=0; i<data.length; i++) {
            for (uint j=0; j<32; j++) {
                byte char = byte(bytes32(uint(data[i]) * 2 ** (8 * j)));
                if (char != 0) {
                    bytesString[urlLength] = char;
                    urlLength += 1;
                }
            }
        }
        bytes memory bytesStringTrimmed = new bytes(urlLength);
        for (i=0; i<urlLength; i++) {
            bytesStringTrimmed[i] = bytesString[i];
        }
        return string(bytesStringTrimmed);
    }    

}