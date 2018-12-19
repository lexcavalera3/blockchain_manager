const assert = require('assert');
const Block = require('blockchain/block');
const BlockChain = require('blockchain/blockchain');
const TrancactionsContainer = require('blockchain/transactions_container');
const rewire = require('rewire');
const mine = rewire('blockchain/mine');


describe('Test mine module', function() {
  it('Test proofOfWork function', function() {
    const amountOfWork = mine.__get__('AMOUNT_OF_WORK');
    const proofOfWork = mine.__get__('proofOfWork');
    const previousProofOfWork = 123;
    const newProofOfWork = proofOfWork(previousProofOfWork);
    assert.ok(newProofOfWork > previousProofOfWork,
        'New proof of work should be greater than previous.');
    assert.strictEqual(newProofOfWork % previousProofOfWork, 0,
        'New proof of work should be divisible by previous.');
    assert.strictEqual(newProofOfWork % amountOfWork, 0,
        'New proof of work should be divisible by amount of work.');
  });

  it('Test generateMineTransaction function', function() {
    const generateMineTransaction = mine.__get__('generateMineTransaction');
    const minerAddress = 'Dummy Miner Address';
    const expectedTransaction = {
      from: 'network',
      to: minerAddress,
      amount: 1
    };

    const actualTransaction = generateMineTransaction(minerAddress);

    assert.deepEqual(expectedTransaction, actualTransaction,
        'Mine transaction should match expected.');
  });

  it('Test mine function', function() {
    const mineFunction = mine;
    const generateMineTransaction = mine.__get__('generateMineTransaction');
    const dummyTransactionsContainer = new TrancactionsContainer();
    const dummyBlockChain = new BlockChain();
    const dummyTransaction = 'Dummy Transaction';
    const minerAddress = 'Dummy Miner Address';
    dummyTransactionsContainer.addTransaction(dummyTransaction);
    const firstBlock = Block.createGenesisBlock();
    dummyBlockChain.addBlock(firstBlock);
    const mineTransaction = generateMineTransaction(minerAddress);

    mineFunction(dummyBlockChain, dummyTransactionsContainer, minerAddress);

    assert.strictEqual(dummyBlockChain.length, 2,
        'There should be 2 blocks in the blockchain.');
    assert.strictEqual(dummyTransactionsContainer.length, 0,
        'Transactions should be empty after mining.');
    const lastBlock = dummyBlockChain.lastBlock;
    const transactions = lastBlock.transactions;
    assert.strictEqual(transactions.length, 2,
        'Mine function should add one more transaction.');
    assert.deepEqual(transactions[0], dummyTransaction,
        'Existing transactions should be stored in new block.');
    assert.deepEqual(transactions[1], mineTransaction,
        'The last transation in the block should be a mine transaction.');
  });
});
