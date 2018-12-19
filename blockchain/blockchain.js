const Block = require('./block');

/**
 * Container for blocks.
 */
class BlockChain {
  /**
   * Creates empty BlockChain.
   */
  constructor() {
    this._blocks = [];
  }

  /**
   * Get blocks from blockchain.
   * @return {array} blocks.
   */
  get blocks() {
    return this._blocks;
  }

  /**
   * Add block to blockchain.
   * @param {object} block - Block, that should be added to the blockchain.
   */
  addBlock(block) {
    this._blocks.push(block);
  }

  /**
   * Get blockchain length.
   * @return {number} Length of the blockchain.
   */
  get length() {
    return this._blocks.length;
  }

  /**
   * Get the last block in the blockchain.
   * @return {Block} Last block.
   */
  get lastBlock() {
    return this._blocks[this._blocks.length - 1];
  }

  /**
   * Restore blockchain from blocks array.
   * @param {array} blocks - array of blocks.
   * @return {BlockChain} Restored blockchain.
   */
  static restoreFromBlocks(blocks) {
    const blockChain = new BlockChain();
    blocks.sort((firstBlock, secondBlock) => firstBlock.index - secondBlock.index);
    blocks.forEach(block => {
      blockChain.addBlock(Block.deserialize(block));
    });
    return blockChain;
  }
}


module.exports = BlockChain;
