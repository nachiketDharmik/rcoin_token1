pragma solidity >=0.4.2 ;

import "./RcoinToken.sol" ;

contract RcoinTokenSale
{

address admin ;
RcoinToken public tokenContract ;
uint256 public tokenPrice ;
uint256 public tokenSold ;

event Sell(address _buyer , uint256 _amount);


    constructor(RcoinToken _tokenContract , uint256 _tokenPrice) public {

      //Assign an admin
      admin = msg.sender ;
      //Token Contract
      tokenContract = _tokenContract ;  
        //Token Price
        tokenPrice = _tokenPrice ;
    }

  // Multiply function
  function multiply (uint x ,uint y ) internal pure returns (uint z) {
      require(y == 0 || (z = x * y) / y == x);
     
  }
    //Buy Tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
      
       require (msg.value == multiply(_numberOfTokens , tokenPrice));
       require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
       require(tokenContract.transfer(msg.sender , _numberOfTokens)); 

        tokenSold += _numberOfTokens ;
        //trigger sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // Ending Token RcoinTokenSale

    function endSale() public {
      // Require admin
      require (msg.sender == admin);
      // Transfer remaining dapp tokens to admin
      require(tokenContract.transfer(admin , tokenContract.balanceOf(address(this))));
      // Destroy contract
    //  selfdestruct(admin);


    }

}