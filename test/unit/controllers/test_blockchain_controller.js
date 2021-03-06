const assert = require('assert');
const rewire = require('rewire');
const BlockChain = require('blockchain/models/blockchain');
const blockChainControllerModule = rewire('blockchain/controllers/blockchain_controller');
const {genesisBlock, secondBlock} = require('../../constants');
const {assertBlocksEqual} = require('../../utils');

let dummyBlocks = [];

/**
 * Mock for readBlocks method.
 * @return {BlockChain} - blockChain from dummy blocks.
 */
function dummyReadBlocks() {
  const blockChain = new BlockChain();
  blockChain.addBlock(genesisBlock);
  blockChain.addBlock(secondBlock);
  return blockChain;
}

/** Another mock for readBlocks method.
 * @return {BlockChain} - empty blockChain.
 */
function dummyReadEmptyBlocks() {
  return new BlockChain();
}

/**
 * Mock for writeBlock method.
 * Writes given block to dummyBlocks array
 * @param {Block} block - block to write
 */
function dummyWriteBlock(block) {
  dummyBlocks.push(block.serialize());
}


describe('Test blockChain controller', () => {
  const BlockChainController = blockChainControllerModule.__get__('BlockChainController');
  const originalReadBlocks = blockChainControllerModule.__get__('readBlocks');
  const originalWriteBlock = blockChainControllerModule.__get__('writeBlock');
  let blockChainController;

  beforeEach(() => {
    blockChainControllerModule.__set__('readBlocks', dummyReadBlocks);
    blockChainControllerModule.__set__('writeBlock', dummyWriteBlock);
    blockChainController = new BlockChainController();
    dummyBlocks = [];
  });

  describe('Test initBlockchain and addAndSaveBlock methods', () => {
    it('Test that blocks are added to blockChain', async () => {
      const expectedBlocks = [genesisBlock.serialize(), secondBlock.serialize()];
      await blockChainController.initBlockchain();
      const actualBlocks = blockChainController.blockChain;
      assertBlocksEqual(expectedBlocks, actualBlocks);
      assert.deepEqual([], dummyBlocks, 'blocks should not be written');
    });

    it('Test that genesis block is added to blockChain in case empty db', async () => {
      blockChainControllerModule.__set__('readBlocks', dummyReadEmptyBlocks);
      const serializedGenesisBlock = genesisBlock.serialize();
      const expectedBlocks = [serializedGenesisBlock];
      await blockChainController.initBlockchain();
      const actualBlocks = blockChainController.blockChain;

      assertBlocksEqual(expectedBlocks, actualBlocks);
      assertBlocksEqual(expectedBlocks, dummyBlocks);
    });
  });

  describe('Test lastProof method', () => {
    it('lastProof should return last blocks proof of work', async () => {
      const expectedProof = secondBlock.proofOfWork;
      await blockChainController.initBlockchain();
      const actualProof = blockChainController.lastProof;
      assert.strictEqual(expectedProof, actualProof);
    });
  });

  describe('Test createNextBlock method', () => {
    const nextBlockData = 'Next Block Data';
    let nextBlock;
    let expectedNextBlock;
    beforeEach(async () => {
      await blockChainController.initBlockchain();
      nextBlock = await blockChainController.createNextBlock(nextBlockData);
      expectedNextBlock = secondBlock.generateNextBlock(nextBlockData).serialize();
    });

    it('Next block should be equal to next block generated by last block', async () => {
      assert.deepEqual(nextBlock, expectedNextBlock);
    });

    it('Next block should be added to blockChain', async () => {
      const lastBlock = blockChainController.blockChain[2];
      assertBlocksEqual(lastBlock, expectedNextBlock);
    });

    it('Next block should be written to db', async () => {
      const writtenBlock = dummyBlocks[0];
      assertBlocksEqual(writtenBlock, expectedNextBlock);
    });
  });

  describe('Test transactions getter', () => {
    it('transactions returned by getter should be equal to all blocks transactions', async () => {
      const expectedTransactions = secondBlock.transactions;
      await blockChainController.initBlockchain();
      const actualTransactions = blockChainController.transactions;
      assert.deepEqual(expectedTransactions, actualTransactions);
    });
  });

  after(() => {
    blockChainControllerModule.__set__('readBlocks', originalReadBlocks);
    blockChainControllerModule.__set__('writeBlock', originalWriteBlock);
  });
});
