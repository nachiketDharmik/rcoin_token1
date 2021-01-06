pragma solidity >0.4.2 ;

contract RcoinToken {

    
    string public name = "Rcoin Token" ;

    string public symbol = "Rcoin" ;

     string public standard = "Rcoin Token v1.0" ;

    uint256 public totalSupply ;

    event Transfer(
             address indexed _from ,
             address indexed _to ,
             uint256 _value
    );

    //approve event 
    event Approval (
        address indexed _owner ,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf ;
    mapping(address => mapping(address => uint256)) public allowance ;


    constructor(uint256 _initialSupply) public{
             balanceOf[msg.sender] = _initialSupply ;
              totalSupply = _initialSupply ;
                       }

     // Transfer
                  
     function transfer(address _to , uint256 _value) public returns (bool success) {

     //Exception if sender has not enough token
     require(balanceOf[msg.sender] >= _value ) ;
     //Transfer the balance
     balanceOf[msg.sender] -= _value ;
     balanceOf[_to] += _value ;
     // Transfer event 
     emit Transfer(msg.sender, _to, _value);

     // RETURN BOOLEAN

     return true ;

     }   

     //Approve

     function approve (address _spender , uint256 _value)public returns (bool success) {
       //Allowance
       allowance[msg.sender][_spender] = _value ;
      //Approve event
      emit Approval(msg.sender, _spender, _value);
       return true ;  
     }

     //TransferFrom
     function transferFrom(address _from , address _to , uint256 _value)public returns(bool success){
         // Require _from has enough tokens
         require(_value <= balanceOf[_from]);

         // Require allowance is big enough
         require(_value <= allowance[_from][msg.sender]);

         // Change the balance
         balanceOf[_from] -= _value ;
         balanceOf[_to]  += _value ;
          // Update the balance
         allowance[_from][msg.sender] -= _value ;
         //Transfer event
         emit Transfer(_from, _to, _value);
         // Return a boolean
         return true ;
     }
}

