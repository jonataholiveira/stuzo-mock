const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { readFileSync } = require('fs');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const FuelOrchClient = require('./fuelOrchClient');
const StuzoProxy = require('./stuzoProxy') 

const oAuthApplicationAuthenticate = require("./responses/oAuthApplicationAuthenticate.json")
const locations = require('./responses/locations.json')
const transactionExternalPaymentStart = require('./responses/startTransaction.json')
const transactionExternalPaymentCancel = require('./responses/cancelTransaction.json')
const transactionExternalPaymentFinalize = require('./responses/finalizeTransaction.json')
const transaction = require('./responses/statusTransaction.json')

const typeDefs = readFileSync('./typeDefs/typeDefs.graphql').toString('utf-8');

const resolvers = {
  Query: {
    locations: () => locations.data.locations,
    transactionLookup: (filter) => transaction.data.transactions
  },

  Mutation: {    
    oAuthApplicationAuthenticate: (credentials) => oAuthApplicationAuthenticate.data.oAuthApplicationAuthenticate,
    transactionExternalPaymentStart: (input) => transactionExternalPaymentStart.data.transactionExternalPaymentStart,
    transactionExternalPaymentCancel: (uuid) => transactionExternalPaymentCancel.data.transactionExternalPaymentCancel,
    transactionExternalPaymentFinalize: (uuid) => transactionExternalPaymentFinalize.data.transactionExternalPaymentFinalize
  }
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  mockEntireSchema: false
});

let stuzoProxy = new StuzoProxy();
let fuelOrchClient = new FuelOrchClient();

app.all("/graphql",  function(req, res) {

  stuzoProxy.proxyAddress(req, res);
  
  bodyAsString = JSON.stringify(req.body);  
  if(bodyAsString.includes('transactionExternalPaymentStart')) {
    fuelOrchClient.executeFuelOrchTransactionLookup();
  }
});

server.applyMiddleware({app});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
