const Block = require('blockchain/models/block');
const Transaction = require('blockchain/models/transaction');
const TransactionsContainer = require('blockchain/models/transactions_container');
const dbConfig = require('config/config').db;
const {minerAddress} = require('config/config').blockchain;

const genesisBlock = Block.createGenesisBlock();
const dummyProofOfWork = 123;
const fromAddress = 'From address';
const toAddress = 'To address';
const amount = 10;
const dummyTransaction = new Transaction(fromAddress, toAddress, amount);
const anotherTransaction = new Transaction('Another from address', 'Another to address', 20);
const mineTransaction = Transaction.createMineTransaction(minerAddress);
const dummyTransactionsContainer = new TransactionsContainer([dummyTransaction]);
const secondBlocksData = {
  proofOfWork: dummyProofOfWork,
  transactions: dummyTransactionsContainer.serialize()
};
const secondBlock = genesisBlock.generateNextBlock(secondBlocksData);
const testDbName = 'test_blockchain';
const originalDbName = dbConfig.name;

module.exports = {
  genesisBlock,
  dummyProofOfWork,
  fromAddress,
  toAddress,
  amount,
  dummyTransaction,
  anotherTransaction,
  mineTransaction,
  dummyTransactionsContainer,
  secondBlocksData,
  secondBlock,
  testDbName,
  originalDbName
};
