App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,
  
    init: function() {
      console.log("App initialized...")
      return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
        } else {
          // Specify default instance if no web3 instance provided
          App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/b4aa481be8814504b6f9b33822fbcc51');
          web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
      },

      initContracts: function() {
        $.getJSON("RcoinTokenSale.json", function(rcoinTokenSale) {
          App.contracts.RcoinTokenSale = TruffleContract(rcoinTokenSale);
          App.contracts.RcoinTokenSale.setProvider(App.web3Provider);
          App.contracts.RcoinTokenSale.deployed().then(function(rcoinTokenSale) {
            console.log("Rcoin Token Sale Address:", rcoinTokenSale.address);
          });
        }).done(function() {
          $.getJSON("RcoinToken.json", function(rcoinToken) {
            App.contracts.RcoinToken = TruffleContract(rcoinToken);
            App.contracts.RcoinToken.setProvider(App.web3Provider);
            App.contracts.RcoinToken.deployed().then(function(rcoinToken) {
              console.log("Rcoin Token Address:", rcoinToken.address);
            });
    
            App.listenForEvents();
            return App.render();
          });
        })
      },


        // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.RcoinTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })

    //transfer event
    App.contracts.RcoinToken.deployed().then(function(instance) {
      instance.Transfer({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })

  },


  // Render function

      render: function() {
        if (App.loading) {
          return;
        }
        App.loading = true;
    
        var loader  = $('#loader');
        var content = $('#content');
    
       loader.show();
        content.hide();
    
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
          if(err === null) {
            App.account = account;
            $('#accountAddress').html("Your Account: " + account);
          }
        })
          
      
    
        // Load token sale contract
        App.contracts.RcoinTokenSale.deployed().then(function(instance) {
          rcoinTokenSaleInstance = instance;
          return rcoinTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice) {
          App.tokenPrice = tokenPrice;
          $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
          return rcoinTokenSaleInstance.tokenSold();
        }).then(function(tokensSold) {
          App.tokensSold = tokensSold.toNumber();
          $('.tokens-sold').html(App.tokensSold);
          $('.tokens-available').html(App.tokensAvailable);
    
          var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
          $('#progress').css('width', progressPercent + '%');
    
          // Load token contract
          App.contracts.RcoinToken.deployed().then(function(instance) {
            rcoinTokenInstance = instance;
            return rcoinTokenInstance.balanceOf(App.account);
          }).then(function(balance) {
            $('.dapp-balance').html(balance.toNumber());
            App.loading = false;
            loader.hide();
            content.show();
          })
        });
      } ,

      buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.RcoinTokenSale.deployed().then(function(instance) {
          return instance.buyTokens(numberOfTokens, {
            from: App.account,
            value: numberOfTokens * App.tokenPrice,
            gas: 500000 // Gas limit
          });
        }).then(function(result) {
          console.log("Tokens bought...")
          $('form').trigger('reset') // reset number of tokens in form
          // Wait for Sell event
        });
      },

//-----Added to send Rcoin tokens
      sendTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens1').val();
        var senderAddress = $('#senderAddress').val();
        
        App.contracts.RcoinToken.deployed().then(function(instance) {
          return instance.transfer(senderAddress , numberOfTokens, {
            from: App.account,
           
            gas: 500000 // Gas limit
          });
        }).then(function(result) {
          console.log("Rcoin token sent...")
          $('form').trigger('reset') // reset number of tokens in form
          // Wait for Sell event
        });
      }


}



$(function() {
    $(window).load(function() {
      App.init();
    })
  });