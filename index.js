const { ApolloServer } = require("apollo-server");
const { readFileSync } = require('fs')

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  mockEntireSchema: false
});

server.listen().then(({ url }) => console.log(`Server running on port ${url}`));