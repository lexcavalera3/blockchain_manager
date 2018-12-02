const sha256 = require('js-sha256').sha256;

/**
 * Block - the core of blockchain.
 * Stores data along with index, creation timestamp and information
 * about previous block.
 */
class Block {
  /**
   * @param {number} index - The index of the block.
   * @param {string} data - Information, that should be stored.
   * @param {string} previousHash - Previous blocks' hash.
   */
  constructor(index, data, previousHash) {
    this.index = index;
    this.timestamp = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this._hashBlock();
  }

  /**
   * Generates unique hash for this block, that depends on all its' fields.
   * @return {string} New hash.
   */
  _hashBlock() {
    return sha256(
        this.index.toString()
        + this.timestamp.toString()
        + this.data.toString()
        + this.previousHash.toString());
  }

  /**
   * Get proof of work for this block.
   * @return {number} Pfoof of work.
   */
  getProofOfWork() {
    return this.data['proof-of-work'];
  }


  /**
   * Get transactions for this block.
   * @return {array} List of transactions.
   */
  getTransactions() {
    return this.data['transactions'];
  }
}

/**
 * Generates first block of the blockchain.
 * @return {Block} First block.
 */
function createGenesisBlock() {
  const genesisData = {
    'proof-of-work': 1,
    'transactions': [],
  };
  return new Block(0, genesisData, '0');
}

/**
 * Generates next block of the blockchain
 * @param {Block} lastBlock - The last block of blockchain.
 * @param {object} newBlockData - Data of the new block.
 * @return {Block} Next block.
 */
function generateNextBlock(lastBlock, newBlockData) {
  return new Block(
      lastBlock.index + 1,
      newBlockData,
      lastBlock.hash
  );
}


module.exports.createGenesisBlock = createGenesisBlock;
module.exports.generateNextBlock = generateNextBlock;
