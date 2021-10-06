const { ApolloServer } = require("apollo-server");
const { readFileSync } = require('fs')

const oAuthApplicationAuthenticate = require("./responses/oAuthApplicationAuthenticate.json")
const locations = require('./responses/locations.json')
const transactionExternalPaymentStart = require('./responses/startTransaction.json')
const transactionExternalPaymentCancel = require('./responses/cancelTransaction.json')
const transactionExternalPaymentFinalize = require('./responses/finalizeTransaction.json')
const transactions = require('./responses/statusTransaction.json')


const typeDefs = readFileSync('./typeDefs/typeDefs.graphql').toString('utf-8');

const resolvers = {
  Query: {
    locations: () => locations.data.locations,
    transactionExternalPaymentCancel: () => transactionExternalPaymentCancel.data.transactionExternalPaymentCancel,
    transactionExternalPaymentFinalize: () => transactionExternalPaymentFinalize.data.transactionExternalPaymentFinalize,
    transactions: () => transactions.data.transactions,
    paymentStart: (uuid) => transactionExternalPaymentStart.data.transactionExternalPaymentStart
  },
  Mutation: {
    transactionExternalPaymentStart: (input) => transactionExternalPaymentStart.data.transactionExternalPaymentStart,
    oAuthApplicationAuthenticate: (credentials) => oAuthApplicationAuthenticate.data.oAuthApplicationAuthenticate
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  mockEntireSchema: false
});

server.listen().then(({ url }) => console.log(`Server running on port ${url}`));