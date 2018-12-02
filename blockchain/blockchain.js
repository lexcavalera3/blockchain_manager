const BasicContainer = require('./basicContainer').BasicContainer;

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
}


module.exports.BlockChain = BlockChain;
