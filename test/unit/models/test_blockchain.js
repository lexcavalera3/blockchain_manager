const assert = require('assert');
const BlockChain = require('blockchain/models/blockchain');
const {genesisBlock, secondBlock} = require('../../constants');


describe('Test BlockChain class', () => {
  const chain = new BlockChain();
  chain.addBlock(genesisBlock);
  chain.addBlock(secondBlock);

  describe('Test general logic.', () => {
    it('Length of blockChain should be equal to count of blocks added to it.', () => {
      assert.strictEqual(chain.length, 2);
    });

    it('Block returned by lastBlock getter should be the last one inserted.', () => {
      assert.strictEqual(chain.lastBlock, secondBlock);
    });

    it('Blocks returned by blocks getter should be an array of all blocks inserted.', () => {
      assert.deepEqual(chain.blocks, [genesisBlock, secondBlock]);
    });
  });

  describe('Test restoreFromBlocks method.', () => {
    it('BlockChain restored from blocks should contain blocks in the right order.', () => {
      const serializedBlocks = [secondBlock.serialize(), genesisBlock.serialize()];
      const restoredBlockchain = BlockChain.restoreFromBlocks(serializedBlocks);
      const restoredBlocks = restoredBlockchain.blocks;
      assert.deepEqual(restoredBlocks, [genesisBlock, secondBlock]);
    });
  });

  describe('Test serialize method.', () => {
    it('Serialized blockChain should be an array of serialized blocks.', () => {
      const serializedBlockChain = chain.serialize();
      const serializedBlocks = [genesisBlock.serialize(), secondBlock.serialize()];
      assert.deepEqual(serializedBlockChain, serializedBlocks);
    });
  });

  describe('Test transactions getter.', () => {
    it('BlockChain transactions should be an array of all its blocks transactions', () => {
      const expectedTransactions = genesisBlock.transactions.concat(secondBlock.transactions);
      const actualTransactions = chain.transactions;
      assert.deepEqual(expectedTransactions, actualTransactions);
    });
  });
});
