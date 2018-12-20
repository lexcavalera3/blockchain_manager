const {sha256} = require('js-sha256');
const TransactionsContainer = require('./transactions_container');

/**
 * Block - the core of blockchain.
 * Stores data along with index, creation timestamp and information
 * about previous block.
 */
class Block {
  /**
   * @param {number} index - The index of the block.
   * @param {object} data - Information, that should be stored.
   * @param {string} previousHash - Previous blocks' hash.
   * @param {Date} [timestamp=new Date] - blocks' timestamp.
   */
  constructor(index, data, previousHash, timestamp) {
    this.index = index;
    this.timestamp = typeof timestamp !== 'undefined' ? timestamp : new Date();
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
  get proofOfWork() {
    return this.data.proofOfWork;
  }

  /**
   * Get transactions for this block.
   * @return {array} List of transactions.
   */
  get transactions() {
    return this.data.transactions;
  }

  /**
   * Convert block to object.
   * @return {object} serialized block.
   */
  serialize() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      data: {
        proofOfWork: this.proofOfWork,
        transactions: this.transactions.serialize()
      },
      previousHash: this.previousHash
    };
  }

  /**
   * Create block from object.
   * @param {object} block - object, that should be deserialized.
   * @return {Block} deserialized block.
   */
  static deserialize(block) {
    const blockData = {
      proofOfWork: block.data.proofOfWork,
      transactions: TransactionsContainer.deserialize(block.data.transactions)
    };
    return new Block(
        block.index,
        blockData,
        block.previousHash,
        block.timestamp
    );
  }

  /**
   * Generates first block of the blockchain.
   * @return {Block} First block.
   */
  static createGenesisBlock() {
    const genesisData = {
      proofOfWork: 1,
      transactions: new TransactionsContainer()
    };
    return new Block(0, genesisData, '0');
  }

  /**
   * Generates next block of the blockchain
   * @param {object} newBlockData - Data of the new block.
   * @return {Block} Next block.
   */
  generateNextBlock(newBlockData) {
    return new Block(
        this.index + 1,
        newBlockData,
        this.hash
    );
  }
}


module.exports = Block;
