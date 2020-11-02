registerEA(
"cryptocurrency_decentralized_exchange",
"A plugin to trade via a cryptocurrency decentralized exchange(v0.09)",
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
}, {
  name: "jssig",
  value: "https://www.fintechee.com/js/eos/eosjs-jssig.min.js",
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
      var jssig = getEAParameter(context, "jssig")
      var exchange = "exchange"

      if (typeof window.dexLibsLoaded == "undefined") {
        window.jsonRpcUrl = jsonRpcUrl
        window.chainId = chainId
        window.scatterCore = scatterCore
        window.scatterEos = scatterEos
        window.jsonrpc = jsonrpc
        window.api = api
        window.jssig = jssig
      }

      if (typeof window.dexLibsLoaded == "undefined" || !window.dexLibsLoaded || window.jsonRpcUrl != jsonRpcUrl || window.chainId != chainId ||
          window.scatterCore != scatterCore || window.scatterEos != scatterEos || window.jsonrpc != jsonrpc || window.api != api || window.jssig != jssig) {
        window.dexLibsLoaded = false
        window.jsonRpcUrl = jsonRpcUrl
        window.chainId = chainId
        window.scatterCore = scatterCore
        window.scatterEos = scatterEos
        window.jsonrpc = jsonrpc
        window.api = api
        window.jssig = jssig

        var tags = document.getElementsByTagName("script")
        for (var i = tags.length - 1; i >= 0; i--) {
          if (tags[i] && tags[i].getAttribute("src") != null &&
            (tags[i].getAttribute("src") == scatterCore || tags[i].getAttribute("src") == scatterEos || tags[i].getAttribute("src") == jsonrpc || tags[i].getAttribute("src") == api || tags[i].getAttribute("src") == jssig)) {

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
                var script5 = document.createElement("script")
                document.body.appendChild(script5)
                script5.onload = function () {
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

                    window.eosjs_jssig = eosjs_jssig
                    window.eosjs_jsonrpc = eosjs_jsonrpc
                    window.eos_rpc = new eosjs_jsonrpc.JsonRpc(jsonRpcUrl)

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
                script5.onerror = function () {
                  popupErrorMessage("Failed to load. Please run this program again.")
                }
                script5.async = true
                script5.src = jssig
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

      // mock
      function getSmartContract (cryptocurrency) {
        if (cryptocurrency == "TOKA") {
          return "tokena"
        } else if (cryptocurrency == "TOKB") {
          return "tokenb"
        } else if (cryptocurrency == "EOS") {
          return "eosio.token"
        }

        return null
      }

      // mock
      function getPlatformCurrency (currency) {
        if (currency == "TOKA") {
          return "EOS"
        } else if (currency == "TOKB") {
          return "EOS"
        }

        return null
      }

      // mock
      function getFeeAmountRequired (platformCurrency) {
        if (platformCurrency == "EOS") {
          return 2
        }

        return null
      }

      // mock
      function getFeeAmountRequiredForCancellation (platformCurrency) {
        if (platformCurrency == "EOS") {
          return 1
        }

        return null
      }

      // mock
      function makeAmountAccurate (currency, amount) {
        if (currency == "TOKA") {
          return amount.toFixed(4)
        } else if (currency == "TOKB") {
          return amount.toFixed(4)
        } else if (currency == "EOS") {
          return amount.toFixed(4)
        }

        return amount + ""
      }

      // mock
      function getAmount (smartContract, data) {
        if (smartContract == "tokena") {
          var quantity = data.quantity.split(" ")
          return {
            amount: quantity[0],
            currency: quantity[1]
          }
        } else if (smartContract == "tokenb") {
          var quantity = data.quantity.split(" ")
          return {
            amount: quantity[0],
            currency: quantity[1]
          }
        } else if (smartContract == "eosio.token") {
          var quantity = data.quantity.split(" ")
          return {
            amount: quantity[0],
            currency: quantity[1]
          }
        }

        return null
      }

      // mock
      function getMemo (smartContract, data) {
        if (smartContract == "tokena") {
          return data.memo
        } else if (smartContract == "tokenb") {
          return data.memo
        } else if (smartContract == "eosio.token") {
          return data.memo
        }

        return null
      }

      function storeOrder (order) {
        if (typeof localStorage.reservedZone == "undefined") {
          localStorage.reservedZone = JSON.stringify({dexOrders: [order]})
        } else {
          var reservedZone = JSON.parse(localStorage.reservedZone)
          if (typeof reservedZone.dexOrders == "undefined") {
            reservedZone.dexOrders = []
          }
          reservedZone.dexOrders.push(order)
          localStorage.reservedZone = JSON.stringify(reservedZone)
        }
      }

      function makeMarket () {
        if (window.dexLibsLoaded) {
          var mailAddr = $("#mail_address").val()
          var baseCryptocurrency = $("#base_cryptocurrency").val()
          var termCryptocurrency = $("#term_cryptocurrency").val()
    			var smartContract = getSmartContract(termCryptocurrency)

          if (mailAddr == "") {
    				popupErrorMessage("The mail address should not be empty.")
    				return
    			}
          if (baseCryptocurrency == "") {
    				popupErrorMessage("The base cryptocurrency should not be empty.")
    				return
    			}
          if (termCryptocurrency == "") {
    				popupErrorMessage("The term cryptocurrency should not be empty.")
    				return
    			}
    			if (smartContract == null || smartContract == "") {
    				popupErrorMessage("The smart contract doesn't exist.")
    				return
    			}
          if ($("#base_amount").val() == "" || isNaN($("#base_amount").val())) {
            popupErrorMessage("The amount of the base cryptocurrency should be a number.")
    				return
          }
          var baseAmountTmp = parseFloat($("#base_amount").val())
          if (baseAmountTmp <= 0) {
    				popupErrorMessage("The amount of the base cryptocurrency should be greater than zero.")
    				return
    			}
          var baseAmount = makeAmountAccurate(baseCryptocurrency, baseAmountTmp)
          if ($("#term_amount").val() == "" || isNaN($("#term_amount").val())) {
            popupErrorMessage("The amount of the term cryptocurrency should be a number.")
    				return
          }
          var termAmountTmp = parseFloat($("#term_amount").val())
    			if (termAmountTmp <= 0) {
    				popupErrorMessage("The amount of the term cryptocurrency should be greater than zero.")
    				return
    			}
          var termAmount = makeAmountAccurate(termCryptocurrency, termAmountTmp)
          var platformCurrency = getPlatformCurrency(termCryptocurrency)
          if (platformCurrency == null) {
            popupErrorMessage("The platform currency doesn't exist.")
    				return
          }
          if ($("#fee_amount").val() == "" || isNaN($("#fee_amount").val())) {
            popupErrorMessage("The fee should be a number.")
    				return
          }
          var feeAmountTmp = parseFloat($("#fee_amount").val())
          var feeAmountRequired = getFeeAmountRequired(platformCurrency)
    			if (feeAmountTmp < feeAmountRequired) {
    				popupErrorMessage("The fee shouldn't be less than " + feeAmountRequired + " " + platformCurrency + ".")
    				return
    			}
          var feeAmount = makeAmountAccurate(platformCurrency, feeAmountTmp)
          if ($("#order_expiration").val() == "" || isNaN($("#order_expiration").val())) {
            popupErrorMessage("The expiration of the order should be an integer.")
    				return
          }
          var orderExpiration = Math.floor(parseInt($("#order_expiration").val())) * 600000
    			if (orderExpiration < 600000) {
    				popupErrorMessage("The expiration of the order should be greater than or equal to ten minutes.")
    				return
    			}

          var memo = baseCryptocurrency + ":" + baseAmount + ":" + termCryptocurrency + ":" + termAmount + ":" + (new Date().getTime() + orderExpiration)
          var feeTrxId = null
          var feeBlockNum = null
          var trxId = null
          var blockNum = null

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
      	                  quantity: feeAmount + " " + platformCurrency,
      	                  memo: "F:" + memo
      	              }
      	          }]
      	        }, {
      	          blocksBehind: 3,
      	          expireSeconds: 30
      	        })

                feeTrxId = result.transaction_id
                feeBlockNum = result.processed.block_num;
      	        //printMessage("Transaction pushed!\n\n" + JSON.stringify(result, null, 2));

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
          	                  quantity: termAmount + " " + termCryptocurrency,
          	                  memo: "O:" + memo
          	              }
          	          }]
          	        }, {
          	          blocksBehind: 3,
          	          expireSeconds: 30
          	        })

                    trxId = result.transaction_id
                    blockNum = result.processed.block_num

                    var order = {
                      platform: "eos",
                      mailAddr: mailAddr,
                      feeTrxId: feeTrxId,
                      feeBlockNum: feeBlockNum,
                      trxId: trxId,
                      blockNum: blockNum,
                      from: account.name,
                      to: exchange,
                      quantity: termAmount + " " + termCryptocurrency,
                      memo: "O:" + memo
                    }
                    storeOrder(order)
                    notifyTransaction(mailAddr, feeTrxId, feeBlockNum, trxId, blockNum)
          	        //printMessage("Transaction pushed!\n\n" + JSON.stringify(result, null, 2))
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

      function cancelOrder (baseCryptocurrency, termCryptocurrency, expirationTmp, trxId, blockNum) {
        if (window.dexLibsLoaded) {
          var expiration = new Date(expirationTmp).getTime()
    			var smartContract = getSmartContract(termCryptocurrency)

          if (expiration <= new Date().getTime()) {
    				popupErrorMessage("The order has expired.")
    				return
    			}
    			if (smartContract == null || smartContract == "") {
    				popupErrorMessage("The smart contract doesn't exist.")
    				return
    			}
          var platformCurrency = getPlatformCurrency(termCryptocurrency)
          if (platformCurrency == null) {
            popupErrorMessage("The platform currency doesn't exist.")
    				return
          }
          var feeAmount = makeAmountAccurate(platformCurrency, getFeeAmountRequiredForCancellation(platformCurrency))

          var memo = baseCryptocurrency + ":" + termCryptocurrency + ":" + trxId + ":" + blockNum;

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
      	                  quantity: feeAmount + " " + platformCurrency,
      	                  memo: "C:" + memo
      	              }
      	          }]
      	        }, {
      	          blocksBehind: 3,
      	          expireSeconds: 30
      	        })

                feeTrxId = result.transaction_id
                feeBlockNum = result.processed.block_num
      	        //printMessage("Transaction pushed!\n\n" + JSON.stringify(result, null, 2))

                notifyTransactionForCancellation(feeTrxId, feeBlockNum)
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
                '<input type="text" id="mail_address" placeholder="Mail Address">' +
              '</div>' +
              '<div class="ui field">' +
                '<input type="text" id="fee_amount" placeholder="Fee (Term Cryptocurrency)">' +
              '</div>' +
              '<div class="ui field">' +
                '<input type="text" id="order_expiration" placeholder="Order Expiration (Hour)">' +
              '</div>' +
            '</div>' +
            '<div class="four fields">' +
              '<div class="field">' +
                '<input type="text" id="base_amount" placeholder="Base Amount">' +
              '</div>' +
              '<div class="field">' +
                '<input type="text" id="base_cryptocurrency" placeholder="Base Cryptocurrency">' +
              '</div>' +
              '<div class="field">' +
                '<input type="text" id="term_cryptocurrency" placeholder="Term Cryptocurrency">' +
              '</div>' +
              '<div class="ui field">' +
                '<input type="text" id="term_amount" placeholder="Term Amount">' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="content">' +
            '<div class="description">' +
              '<table id="crypto_dex_orderbook" class="cell-border" cellspacing="0">' +
              '</table>' +
            '</div>' +
          '</div>' +
          '<div class="content">' +
            '<div class="description">' +
              '<table id="crypto_dex_myorders" class="cell-border nowrap" cellspacing="0">' +
              '</table>' +
            '</div>' +
          '</div>' +
          '<div class="actions">' +
            '<div class="ui button" id="show_orders">Show Orders</div>' +
            '<div class="ui button" id="show_my_orders">My Orders</div>' +
            '<div class="ui button" id="make_market">Make Market</div>' +
            '<div class="ui button" id="eos_logout">Log out</div>' +
          '</div>' +
        '</div>'

        $("#reserved_zone").html(panel)
      }

      if (!$.fn.dataTable.isDataTable("#crypto_dex_orderbook")) {
  			$("#crypto_dex_orderbook").DataTable({
  				data: [],
  				columns: [
  					{title: "Amount"},
  					{title: "Base"},
            {title: "Price"},
  					{title: "Term"},
  					{title: "Amount"}
  				],
          ordering: false,
          searching: false,
          bPaginate: false,
          bLengthChange: false,
          bFilter: false,
          bInfo: false,
          scrollY: '50vh',
          scrollCollapse: true,
          paging: false,
          columnDefs: [
            {width: "20%", targets: 0, className: "dt-body-right"},
            {width: "20%", targets: 1, className: "dt-body-center"},
            {width: "20%", targets: 2, className: "dt-body-right"},
            {width: "20%", targets: 3, className: "dt-body-center"},
            {width: "20%", targets: 4, className: "dt-body-right"},
            {width: "20%", targets: [0, 1, 2, 3, 4], className: "dt-head-center"}
          ]
  			})
  		}

      var table = null

      if (!$.fn.dataTable.isDataTable("#crypto_dex_myorders")) {
  			table = $("#crypto_dex_myorders").DataTable({
  				data: [],
  				columns: [
  					{title: "Amount"},
  					{title: "Base"},
            {title: "Price"},
  					{title: "Term"},
  					{title: "Amount"},
            {title: "Expiration"},
            {title: "TrxId"},
            {title: "BlockNum"},
            {title: "Op"}
  				],
          ordering: false,
          searching: false,
          bPaginate: false,
          bLengthChange: false,
          bFilter: false,
          bInfo: false,
          scrollY: '50vh',
          scrollCollapse: true,
          paging: false,
          columnDefs: [
            {width: "16%", targets: 0, className: "dt-body-right"},
            {width: "16%", targets: 1, className: "dt-body-center"},
            {width: "16%", targets: 2, className: "dt-body-right"},
            {width: "16%", targets: 3, className: "dt-body-center"},
            {width: "16%", targets: 4, className: "dt-body-right"},
            {width: "10%", targets: 5, className: "dt-body-center"},
            {width: "10%", targets: 6, className: "dt-body-center"},
            {width: "5%", targets: 7, className: "dt-body-center"},
            {width: "5%", targets: 8, className: "dt-body-center"},
            {width: "16%", targets: [0, 1, 2, 3, 4], className: "dt-head-center"},
            {width: "10%", targets: [5, 6], className: "dt-head-center"},
            {width: "5%", targets: [7, 8], className: "dt-head-center"},
            {targets: -1, data: null, defaultContent: '<button id="btn_cancel_order" class="ui icon white inverted button" style="padding:0 5px 0 5px"><i class="window close red icon"></i></button>'}
          ]
  			})
  		}

      $("#show_orders").on("click", function () {
        var baseCryptocurrency = $("#base_cryptocurrency").val()
        var termCryptocurrency = $("#term_cryptocurrency").val()
        if (baseCryptocurrency == "") {
          popupErrorMessage("The base cryptocurrency should not be empty.")
          return
        }
        if (termCryptocurrency == "") {
          popupErrorMessage("The term cryptocurrency should not be empty.")
          return
        }

        $("#crypto_dex_orderbook").DataTable().clear().draw()

        var orders = getOrders(baseCryptocurrency, termCryptocurrency)

        orders.sort(function (a, b) {return b.price - a.price})

        for (var i in orders) {
          $("#crypto_dex_orderbook").DataTable().row.add([
            orders[i].baseAmount != null ? orders[i].baseAmount : "",
            orders[i].baseCryptocurrency != null ? orders[i].baseCryptocurrency : "",
            orders[i].price != null ? orders[i].price : "",
            orders[i].termCryptocurrency != null ? orders[i].termCryptocurrency : "",
            orders[i].termAmount != null ? orders[i].termAmount : ""
          ]).draw(false)
        }
      })

      $("#show_my_orders").on("click", function () {
        var mailAddress = $("#mail_address").val()
        if (mailAddress == "") {
          popupErrorMessage("The mail address should not be empty.")
          return
        }
        var baseCryptocurrency = $("#base_cryptocurrency").val()
        var termCryptocurrency = $("#term_cryptocurrency").val()
        if (baseCryptocurrency == "") {
          popupErrorMessage("The base cryptocurrency should not be empty.")
          return
        }
        if (termCryptocurrency == "") {
          popupErrorMessage("The term cryptocurrency should not be empty.")
          return
        }

        $("#crypto_dex_myorders").DataTable().clear().draw()

        var orders = getMyOrders(mailAddress, baseCryptocurrency, termCryptocurrency)

        for (var i in orders) {
          $("#crypto_dex_myorders").DataTable().row.add([
            orders[i].baseAmount != null ? orders[i].baseAmount : "",
            orders[i].baseCryptocurrency != null ? orders[i].baseCryptocurrency : "",
            orders[i].price != null ? orders[i].price : "",
            orders[i].termCryptocurrency != null ? orders[i].termCryptocurrency : "",
            orders[i].termAmount != null ? orders[i].termAmount : "",
            orders[i].expiration != null ? new Date(orders[i].expiration) : "",
            orders[i].trxId != null ? orders[i].trxId : "",
            orders[i].blockNum != null ? orders[i].blockNum : ""
          ]).draw(false)
        }
      })

      $("#crypto_dex_myorders tbody").on("click", "button", function () {
				if (table != null) {
					var data = table.row($(this).parents("tr")).data()
					if (typeof data == "undefined") {
						data = table.row($(this)).data()
					}

          if (data[0] != "") {
            cancelOrder(data[3], data[1], data[5], data[6], data[7])
          } else {
            cancelOrder(data[1], data[3], data[5], data[6], data[7])
          }
				}
			})

      $("#make_market").on("click", function () {
        makeMarket()
      })

      $("#eos_logout").on("click", function () {
        if (typeof window.scatter != "undefined" && window.scatter != null) {
          window.scatter.logout()
          delete window.scatter
          delete window.eosjs_jssig
          delete window.eosjs_jsonrpc
          delete window.eos_rpc
          delete window.eos_api
          delete window.dexLibsLoaded
          delete window.jsonRpcUrl
          delete window.chainId
          delete window.scatterCore
          delete window.scatterEos
          delete window.jsonrpc
          delete window.api
        }
      })

      $("#crypto_dex_dashboard").modal("show")
    },
function (context) { // Deinit()
		},
function (context) { // OnTick()
		})
