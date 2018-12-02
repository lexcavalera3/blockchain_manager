const BasicContainer = require('./basicContainer').BasicContainer;

/**
 * Container for transactions.
 */
class Transactions extends BasicContainer {
  /**
   * Remove all elements from transactions container.
   */
  clearData() {
    this.data = [];
  }
}


module.exports.Transactions = Transactions;
