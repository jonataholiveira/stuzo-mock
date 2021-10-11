const axios = require('axios')
const appConfig = require('./resources/applicationProperties.json')
const startTransactionData = require('./responses/startTransaction.json')

class FuelOrchClient {

  constructor() {

  }

  executeFuelOrchTransactionLookup() {
    
    var that = this;

    setTimeout(function(){
      that.transactionLookupPostRequest('RESERVING_PUMP');
    }, 5 * 1000);

    setTimeout(function(){
      that.transactionLookupPostRequest('PUMP_RESERVED');
    }, 10 * 1000);
  }

  transactionLookupPostRequest(transactionState)  {

    console.log('Sending webhook post request with transaction state: ['+ transactionState +']');

    var webhookUrl = this.resolveFuelOrchestratorWebHookURL(transactionState);
    console.log('Webhook address is being called: ['+ webhookUrl +']');

    axios.get('http://localhost:8082/hello')
    .then(e => {
        console.log('Callback sent.');
    })
    .catch(error => {
      console.log(error);
    });

    console.log('Request was sent.'); 
  }

  resolveFuelOrchestratorWebHookURL(transactionState) {

    var url = appConfig.fuelOrchestratorHostConfiguration.protocol + "://" 
        + appConfig.fuelOrchestratorHostConfiguration.hostAddress + ":"
        + appConfig.fuelOrchestratorHostConfiguration.port + "/"
        + startTransactionData.data.transactionExternalPaymentStart.uuid + "/"
        + transactionState
    
    return url;
  }
}

module.exports = FuelOrchClient;
