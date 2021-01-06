const RcoinToken = artifacts.require("./RcoinToken.sol");
const RcoinTokenSale = artifacts.require("./RcoinTokenSale.sol");


module.exports = function(deployer) {
  deployer.deploy(RcoinToken , 1000000).then(function() {
    //Token price is 0.001Ether
    var tokenPrice = 1000000000000000
    return deployer.deploy(RcoinTokenSale , RcoinToken.address , tokenPrice); //we are passing RcoinToken adderess to the RcointokenSale constructor
  }); //here 1000000 is the value that we pass to constructur 
  
};
