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
   * Get blocks from blockChain.
   * @return {array} blocks.
   */
  get blocks() {
    return this._blocks;
  }

  /**
   * Add block to blockChain.
   * @param {object} block - Block, that should be added to the blockChain.
   */
  addBlock(block) {
    this._blocks.push(block);
  }

  /**
   * Get blockChain length.
   * @return {number} Length of the blockChain.
   */
  get length() {
    return this._blocks.length;
  }

  /**
   * Get the last block in the blockChain.
   * @return {Block} Last block.
   */
  get lastBlock() {
    return this._blocks[this._blocks.length - 1];
  }

  /**
   * Restore blockChain from blocks array.
   * @param {array} blocks - array of blocks.
   * @return {BlockChain} Restored blockChain.
   */
  static restoreFromBlocks(blocks) {
    const blockChain = new BlockChain();
    blocks.sort((firstBlock, secondBlock) => firstBlock.index - secondBlock.index);
    blocks.forEach(block => {
      blockChain.addBlock(Block.deserialize(block));
    });
    return blockChain;
  }

  /**
   * Serialize blocks from blockChain
   * @return {array} - serialized blocks.
   */
  serialize() {
    return this._blocks.map(block => block.serialize());
  }

  /**
   * Gather transactions from all blocks in blockChain.
   * @return {array} - all blocks' transactions.
   */
  get transactions() {
    const groupedTransactions = this._blocks.map(block => block.transactions);
    return groupedTransactions.reduce((firstArray, secondArray) => firstArray.concat(secondArray), []);
  }
}


module.exports = BlockChain;
