/**
 * Container for transactions.
 */
class TransactionsContainer {
  /**
   * Creates empty TransactionsContainer.
   */
  constructor() {
    this._transactions = [];
  }

  /**
   * Get transactions from the container.
   * @return {array} transaction.
   */
  get transactions() {
    return this._transactions;
  }

  /**
   * Add transaction to container.
   * @param {object} transaction - Transaction, that should be added to the container.
   */
  addTransaction(transaction) {
    this._transactions.push(transaction);
  }

  /**
   * Remove all elements from transactions container.
   */
  clearTransactions() {
    this._transactions = [];
  }

  /**
   * Get transactions container length.
   * @return {number} Length of the container.
   */
  get length() {
    return this._transactions.length;
  }
}


module.exports = TransactionsContainer;
