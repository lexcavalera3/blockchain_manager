const Block = require('blockchain/models/block');
const Transaction = require('blockchain/models/transaction');
const TransactionsContainer = require('blockchain/models/transactions_container');

const genesisBlock = Block.createGenesisBlock();
const dummyProofOfWork = 123;
const dummyTransaction = new Transaction('From address', 'To address', 10);
const anotherTransaction = new Transaction('Another from address', 'Another to address', 20);
const dummyTransactionsContainer = new TransactionsContainer([dummyTransaction]);
const secondBlocksData = {
  proofOfWork: dummyProofOfWork,
  transactions: dummyTransactionsContainer
};
const secondBlock = genesisBlock.generateNextBlock(secondBlocksData);

module.exports = {
  genesisBlock,
  dummyProofOfWork,
  dummyTransaction,
  anotherTransaction,
  dummyTransactionsContainer,
  secondBlocksData,
  secondBlock
};
