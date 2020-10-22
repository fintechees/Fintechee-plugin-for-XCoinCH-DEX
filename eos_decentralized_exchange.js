registerEA(
"cryptocurrency_decentralized_exchange",
"A plugin to trade via a cryptocurrency decentralized exchange(v0.01)",
[{
  name: "jsonRpcUrl",
  value: "http://127.0.0.1:8888", // "https://nodes.get-scatter.com",
  required: true,
  type: PARAMETER_TYPE.STRING,
  range: null
}, {
  name: "chainId",
  value: "8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f", // "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  required: true,
  type: PARAMETER_TYPE.STRING,
  range: null
}, {
  name: "scatterCore",
  value: "https://www.fintechee.com/js/eos/scatterjs-core.min.js",
  required: true,
  type: PARAMETER_TYPE.STRING,
  range: null
}, {
  name: "scatterEos",
  value: "https://www.fintechee.com/js/eos/scatterjs-plugin-eosjs2.min.js",
  required: true,
  type: PARAMETER_TYPE.STRING,
  range: null
}, {
  name: "jsonrpc",
  value: "https://www.fintechee.com/js/eos/eosjs-jsonrpc.min.js",
  required: true,
  type: PARAMETER_TYPE.STRING,
  range: null
}, {
  name: "api",
  value: "https://www.fintechee.com/js/eos/eosjs-api.min.js",
  required: true,
  type: PARAMETER_TYPE.STRING,
  range: null
}],
function (context) { // Init()
      var jsonRpcUrl = getEAParameter(context, "jsonRpcUrl")
      var chainId = getEAParameter(context, "chainId")
      var scatterCore = getEAParameter(context, "scatterCore")
      var scatterEos = getEAParameter(context, "scatterEos")
      var jsonrpc = getEAParameter(context, "jsonrpc")
      var api = getEAParameter(context, "api")

      if (typeof window.dexLibsLoaded == "undefined") {
        window.jsonRpcUrl = jsonRpcUrl
        window.chainId = chainId
        window.scatterCore = scatterCore
        window.scatterEos = scatterEos
        window.jsonrpc = jsonrpc
        window.api = api
      }

      if (typeof window.dexLibsLoaded == "undefined" || !window.dexLibsLoaded || window.jsonRpcUrl != jsonRpcUrl || window.chainId != chainId ||
          window.scatterCore != scatterCore || window.scatterEos != scatterEos || window.jsonrpc != jsonrpc || window.api != api) {
        window.dexLibsLoaded = false
        window.jsonRpcUrl = jsonRpcUrl
        window.chainId = chainId
        window.scatterCore = scatterCore
        window.scatterEos = scatterEos
        window.jsonrpc = jsonrpc
        window.api = api

        var tags = document.getElementsByTagName("script")
        for (var i = tags.length - 1; i >= 0; i--) {
          if (tags[i] && tags[i].getAttribute("src") != null &&
            (tags[i].getAttribute("src") == scatterCore || tags[i].getAttribute("src") == scatterEos || tags[i].getAttribute("src") == jsonrpc || tags[i].getAttribute("src") == api)) {

            tags[i].parentNode.removeChild(tags[i])
          }
        }

        var script1 = document.createElement("script")
        document.body.appendChild(script1)
        script1.onload = function () {
          var script2 = document.createElement("script")
          document.body.appendChild(script2)
          script2.onload = function () {
            var script3 = document.createElement("script")
            document.body.appendChild(script3)
            script3.onload = function () {
              var script4 = document.createElement("script")
              document.body.appendChild(script4)
              script4.onload = function () {
                var parsedJsonRpcUrl = jsonRpcUrl.split("://")
                var parsedJsonRpcUrl2 = parsedJsonRpcUrl[1].split(":")
                window.network = ScatterJS.Network.fromJson({
                  blockchain: "eos",
                  protocol: parsedJsonRpcUrl[0],
                  host: parsedJsonRpcUrl2[0],
                  port: parsedJsonRpcUrl2.length == 1 ? 443 : parseInt(parsedJsonRpcUrl2[1]),
                  chainId: chainId
                })
                ScatterJS.plugins(new ScatterEOS())
                ScatterJS.scatter.connect("www.fintechee.com", {network: window.network}).then(function (connected) {
                  if(!connected) {
                    popupErrorMessage("Failed to connect to your Scatter APP.")
                    return false
                  }

                  const scatter = ScatterJS.scatter

                  window.eosjs_jsonrpc = eosjs_jsonrpc
                  var eos_rpc = new eosjs_jsonrpc.JsonRpc(jsonRpcUrl)

                  window.eos_api = scatter.eos(network, eosjs_api.Api, {rpc: eos_rpc});

                  (async function () {
                    if (scatter.identity) {
                      scatter.logout()
                    }

                    await scatter.login()
                    window.scatter = scatter

                    window.dexLibsLoaded = true

                    popupMessage("Connected to Scatter successfully!")
                  })()
                  window.ScatterJS = null
                })
              }
              script4.onerror = function () {
                popupErrorMessage("Failed to load. Please run this program again.")
              }
              script4.async = true
              script4.src = scatterEos
            }
            script3.onerror = function () {
              popupErrorMessage("Failed to load. Please run this program again.")
            }
            script3.async = true
            script3.src = scatterCore
          }
          script2.onerror = function () {
            popupErrorMessage("Failed to load. Please run this program again.")
          }
          script2.async = true
          script2.src = jsonrpc
        }
        script1.onerror = function () {
          popupErrorMessage("Failed to load. Please run this program again.")
        }
        script1.async = true
        script1.src = api
      }

      function getSmartContract (termCryptocurrency) {
        if (termCryptocurrency == "TOKA") {
          return "tokena"
        } else if (termCryptocurrency == "TOKB") {
          return "tokenb"
        }

        return null
      }

      var exchange = "exchange"

      function makeMarket () {
        if (window.dexLibsLoaded) {
          var baseCryptocurrency = $("#base_cryptocurrency").val()
          var termCryptocurrency = $("#term_cryptocurrency").val()
    			var smartContract = getSmartContract(termCryptocurrency)

          if (baseCryptocurrency == null || baseCryptocurrency == "") {
    				popupErrorMessage("The base cryptocurrency should not be empty.")
    				return
    			}
          if (termCryptocurrency == null || termCryptocurrency == "") {
    				popupErrorMessage("The term cryptocurrency should not be empty.")
    				return
    			}
    			if (smartContract == null || smartContract == "") {
    				popupErrorMessage("The smart contract doesn't exist.")
    				return
    			}
          if (isNaN($("#base_amount").val())) {
            popupErrorMessage("The amount of the base cryptocurrency should be a number.")
    				return
          }
          var baseAmount =  ? Math.floor(parseFloat($("#base_amount").val()))
          if (baseAmount <= 0) {
    				popupErrorMessage("The amount of the base cryptocurrency should be greater than zero.")
    				return
    			}
          if (isNaN($("#term_amount").val())) {
            popupErrorMessage("The amount of the term cryptocurrency should be a number.")
    				return
          }
          var termAmount = Math.floor(parseFloat($("#term_amount").val()))
    			if (termAmount <= 0) {
    				popupErrorMessage("The amount of the term cryptocurrency should be greater than zero.")
    				return
    			}
          if (isNaN($("#order_expiration").val())) {
            popupErrorMessage("The expiration of the order should be an integer.")
    				return
          }
          var orderExpiration = Math.floor(parseInt($("#order_expiration").val()))
    			if (orderExpiration < 3600) {
    				popupErrorMessage("The expiration of the order should be greater than or equal to 3600.")
    				return
    			}

          var memo = (new Date().getTime() + orderExpiration * 1000) + ":" + baseCryptocurrency + ":" + baseAmount

          const requiredFields = {accounts: [window.network]}
          window.scatter.getIdentity(requiredFields).then(() => {
            const account = window.scatter.identity.accounts.find(x => x.blockchain === "eos");

            (async () => {
      	      try {
      	        const result = await window.eos_api.transact({
      	          actions: [{
      	              account: "eosio.token",
      	              name: "transfer",
      	              authorization: [{
      	                  actor: account.name,
      	                  permission: account.authority,
      	              }],
      	              data: {
      	                  from: account.name,
      	                  to: exchange,
      	                  quantity: "1.0000 EOS",
      	                  memo: "F:" + memo
      	              }
      	          }]
      	        }, {
      	          blocksBehind: 3,
      	          expireSeconds: 30
      	        })

      	        popupMessage("Transaction pushed!\n\n" + JSON.stringify(result, null, 2))

                (async () => {
          	      try {
          	        const result = await window.eos_api.transact({
          	          actions: [{
          	              account: smartContract,
          	              name: "transfer",
          	              authorization: [{
          	                  actor: account.name,
          	                  permission: account.authority,
          	              }],
          	              data: {
          	                  from: account.name,
          	                  to: exchange,
          	                  quantity: termAmount + ".0000 " + termCryptocurrency,
          	                  memo: "O:" + memo
          	              }
          	          }]
          	        }, {
          	          blocksBehind: 3,
          	          expireSeconds: 30
          	        })

          	        popupMessage("Transaction pushed!\n\n" + JSON.stringify(result, null, 2))
          	      } catch (e) {
          					popupErrorMessage("Caught exception: " + e)

          	        if (e instanceof window.eosjs_jsonrpc.RpcError) {
          						popupErrorMessage(JSON.stringify(e.json, null, 2))
          					}
          	      }
          	    })()
      	      } catch (e) {
      					popupErrorMessage("Caught exception: " + e)

      	        if (e instanceof window.eosjs_jsonrpc.RpcError) {
      						popupErrorMessage(JSON.stringify(e.json, null, 2))
      					}
      	      }
      	    })()
          }).catch(error => {
            popupErrorMessage(error)
          })
        }
      }

      if (typeof $("#crypto_dex_dashboard").html() == "undefined") {
        var panel = '<div class="ui form modal" id="crypto_dex_dashboard">' +
          '<i class="close icon"></i>' +
          '<div class="content">' +
            '<div class="three fields">' +
              '<div class="field">' +
                '<input type="text" id="base_cryptocurrency" placeholder="Base Cryptocurrency">' +
              '</div>' +
              '<div class="field">' +
                '<input type="text" id="term_cryptocurrency" placeholder="Term Cryptocurrency">' +
              '</div>' +
              '<div class="ui field">' +
                '<input type="text" id="term_amount" placeholder="Amount">' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="content">' +
            '<div class="description">' +
              '<table id="crypto_dex_orderbook" class="cell-border" cellspacing="0">' +
              '</table>' +
            '</div>' +
          '</div>' +
          '<div class="actions">' +
            '<div class="ui button" id="make_market">Make Market</div>' +
            '<div class="ui button" id="eos_logout">Log out</div>' +
          '</div>' +
        '</div>'

        $("#reserved_zone").html(panel)
      }

      $("#make_market").on("click", function () {
        makeMarket()
      })

      $("#eos_logout").on("click", function () {
        if (typeof window.scatter != "undefined" && window.scatter != null) {
          window.scatter.logout()
          window.scatter = null
        }
      })

      $("#crypto_dex_dashboard").modal("show")
    },
function (context) { // Deinit()
		},
function (context) { // OnTick()
		})
