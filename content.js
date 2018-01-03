// Asynchronous HTTP Requestor
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    };
};

// Collection of Website Information by Class
var names = document.getElementsByClassName('coin ng-binding');
var amounts = document.getElementsByClassName('total f-right ng-binding');
var btcs = document.getElementsByClassName('equalValue f-right ng-binding');
var namesIndex = [];

// Test if prices have already been added
if (amounts[1].innerHTML.includes("$")) {
  for (var i = 1; i < amounts.length; i++) {
    // Removal of previous prices
    amounts[i].innerHTML = amounts[i].innerHTML.substring(0, amounts[i].innerHTML.indexOf('$')).slice(0, -4);
  }
}

// Synchronous spawner of asynchronous requests based off found wallets
// To-do: Only request values above 0
for (var i = 1, l = amounts.length; i < l; i++) {
  var coinValue = "";
  namesIndex.push(names[i].innerHTML);
  // To-do: Add more currencies to convert to than USD
  var request = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD';
  requestion(request, names[i].innerHTML);
}

// Asynchronous calling
function requestion(request, name) {
  var client = new HttpClient();
  client.get(request, function(response) {
    parseP(name, response);
  });
}

// Parsing of HTTP request
function parseP(coinName, coinValue) {
  coinValue = coinValue.substr(7);
  coinValue = coinValue.substr(0, coinValue.length - 1);
  //console.log('DEBUG: Coin Name: ' + coinName.replace(/<(?:.|\n)*?>/gm, ''));
  //console.log('DEBUG: Coin Value: ' + parseFloat(coinValue));
  var index = indexFinder(coinName);
  //console.log('DEBUG: Coin Amounts: ' + parseFloat(amounts[index].innerHTML));
  var output = parseFloat(coinValue) * parseFloat(btcs[index].innerHTML);
  output = " - $" + output.toFixed(2);
  //console.log('TOTAL: ' + output);
  // To-do: Add tradingview graphs to changed elements
  // Final posting of data
  amounts[index].innerHTML += output;
}

//Indexing agent for matching asynchronous replies to page
function indexFinder(coinName) {
  function finding(element) {
    return element === coinName;
  }
  return namesIndex.findIndex(finding);
}
