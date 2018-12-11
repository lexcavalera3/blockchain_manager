const BasicContainer = require('./basicContainer').BasicContainer;
const Block = require('./block').Block;

/**
 * Container for blocks.
 */
class BlockChain extends BasicContainer {
  /**
   * Get the last block in the blockchain.
   * @return {Block} Last block.
   */
  getLastBlock() {
    return this.data[this.data.length - 1];
  }

  /**
   * Restore blockchain from blocks array.
   * @param {array} blocks - array of blocks.
   * @return {BlockChain} Restored blockchain.
   */
  static restoreFromBlocks(blocks) {
    const blockChain = new BlockChain();
    blocks.sort(
        (firstBlock, secondBlock) => firstBlock.index - secondBlock.index);
    blocks.forEach(function(block) {
      blockChain.append(Block.deserialize(block));
    });
    return blockChain;
  }
}


module.exports.BlockChain = BlockChain;
