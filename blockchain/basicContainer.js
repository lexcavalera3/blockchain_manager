/**
 * The basic class for transactions and blockchain.
 */
class BasicContainer {
  /**
   * Creates empty container.
   */
  constructor() {
    this.data = [];
  }

  /**
   * Get containers' data.
   * @return {array} Containers' data.
   */
  getData() {
    return this.data;
  }

  /**
   * Add element to container.
   * @param {object} element - Element, that should be added to the container.
   */
  append(element) {
    this.data.push(element);
  }

  /**
   * Get container length.
   * @return {number} Length of the container.
   */
  getLength() {
    return this.data.length;
  }
}


module.exports.BasicContainer = BasicContainer;
