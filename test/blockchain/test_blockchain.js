const assert = require('assert');
const BlockChain = require('blockchain/blockchain');
const {genesisBlock, secondBlock} = require('../constants');


describe('Test BlockChain class', () => {
  describe('Test general logic.', () => {
    const chain = new BlockChain();
    chain.addBlock(genesisBlock);
    chain.addBlock(secondBlock);

    it('Length of blockchain should be equal to count of blocks added to it.', () => {
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
    it('Blockchain restored from blocks should contain blocks in the right order.', () => {
      const serializedBlocks = [secondBlock.serialize(), genesisBlock.serialize()];
      const restoredBlockchain = BlockChain.restoreFromBlocks(serializedBlocks);
      const restoredBlocks = restoredBlockchain.blocks;
      assert.deepEqual(restoredBlocks, [genesisBlock, secondBlock]);
    });
  });
});
