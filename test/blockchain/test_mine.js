const assert = require('assert');
const BlockChain = require('blockchain/blockchain');
const Transaction = require('blockchain/transaction');
const TransactionsContainer = require('blockchain/transactions_container');
const rewire = require('rewire');
const mine = rewire('blockchain/mine');
const {genesisBlock, dummyTransaction} = require('../constants');


describe('Test mine module', () => {
  describe('Test proofOfWork function', () => {
    const AMOUNT_OF_WORK = mine.__get__('AMOUNT_OF_WORK');
    const proofOfWork = mine.__get__('proofOfWork');
    const previousProofOfWork = 123;
    const newProofOfWork = proofOfWork(previousProofOfWork);

    it('New proof of work should be greater than previous.', () => {
      assert.ok(newProofOfWork > previousProofOfWork);
    });

    it('New proof of work should be divisible by previous.', () => {
      assert.strictEqual(newProofOfWork % previousProofOfWork, 0);
    });

    it('New proof of work should be divisible by amount of work.', () => {
      assert.strictEqual(newProofOfWork % AMOUNT_OF_WORK, 0);
    });
  });

  describe('Test mine function', () => {
    const mineFunction = mine;
    const dummyTransactionsContainer = new TransactionsContainer();
    const dummyBlockChain = new BlockChain();
    dummyTransactionsContainer.addTransaction(dummyTransaction);
    dummyBlockChain.addBlock(genesisBlock);
    const minerAddress = 'Miner Address';
    const mineTransaction = Transaction.createMineTransaction(minerAddress);

    mineFunction(dummyBlockChain, dummyTransactionsContainer, minerAddress);

    const lastBlock = dummyBlockChain.lastBlock;
    const lastBlockTransactions = lastBlock.transactions;

    it('There should be 2 blocks in the blockchain.', () => {
      assert.strictEqual(dummyBlockChain.length, 2);
    });

    it('Transactions should be empty after mining.', () => {
      assert.strictEqual(dummyTransactionsContainer.length, 0);
    });

    it('Mine function should add one more transaction.', () => {
      assert.strictEqual(lastBlockTransactions.length, 2);
    });

    it('Existing transactions should be stored in new block.', () => {
      assert.deepEqual(lastBlockTransactions[0], dummyTransaction);
    });

    it('The last transation in the block should be a mine transaction.', () => {
      assert.deepEqual(lastBlockTransactions[1], mineTransaction);
    });
  });
});
