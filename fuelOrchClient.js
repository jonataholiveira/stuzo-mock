const axios = require('axios')
const appConfig = require('./resources/applicationProperties.json')
const startTransactionData = require('./responses/startTransaction.json')

class FuelOrchClient {

  constructor() {

  }

  executeFuelOrchTransactionExternalPaymentStartCallback() {
    
    var that = this;

    setTimeout(function(){
      that.transactionLookupPostRequest('RESERVING_PUMP');
    }, 10 * 1000);

    setTimeout(function(){
      that.transactionLookupPostRequest('PUMP_RESERVED');
    }, 15 * 1000);

    setTimeout(function(){
      that.transactionLookupPostRequest('FUELING_COMPLETED');
    }, 20 * 1000);
  }

  executeTransactionExternalPaymentFinalizeCallback() {

    var that = this;
    setTimeout(function(){
      that.transactionLookupPostRequest('RECEIPT_READY');
    }, 10 * 1000);

  }
  

  transactionLookupPostRequest(transactionState)  {

    console.log("<")
    console.log('Sending webhook post request with transaction state: ['+ transactionState +']');

    var webhookUrl = this.resolveFuelOrchestratorWebHookURL(transactionState);
    console.log('Fuel Orch. http address:\n['+ webhookUrl +']');

    axios.post(webhookUrl)
    .then(e => {
        console.log('Callback/Webhook to Fuel Orch. was just sent.');
    })
    .catch(error => {
      console.log(error);
    });

  }

  resolveFuelOrchestratorWebHookURL(transactionState) {

    var url = appConfig.fuelOrchestratorHostConfiguration.protocol + "://" 
        + appConfig.fuelOrchestratorHostConfiguration.hostAddress + ":"
        + appConfig.fuelOrchestratorHostConfiguration.port + "/"
        + appConfig.fuelOrchestratorHostConfiguration.baseParh + "/"
        + startTransactionData.data.transactionExternalPaymentStart.uuid + "/"
        + transactionState
    
    return url;
  }
}

module.exports = FuelOrchClient;
