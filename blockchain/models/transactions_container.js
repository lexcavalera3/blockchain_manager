const Transaction = require('./transaction');

/**
 * Container for transactions.
 */
class TransactionsContainer {
  /**
   * Creates TransactionsContainer.
   * @param {array} [transactions=[]] - transactions, that should be stored in the container.
   */
  constructor(transactions=[]) {
    this._transactions = transactions;
  }

  /**
   * Get transactions from the container.
   * @return {array} transactions.
   */
  get transactions() {
    return this._transactions;
  }

  /**
   * Add transaction to container.
   * @param {Transaction} transaction - Transaction, that should be added to the container.
   */
  addTransaction(transaction) {
    this._transactions.push(transaction);
  }

  /**
   * Remove all transactions from the container.
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

  /**
   * Serialize transactions container (serialize all transactions).
   * @return {array} Serialized transactions.
   */
  serialize() {
    return this._transactions.map(transaction => transaction.serialize());
  }

  /**
   * Create deserialized transactions container.
   * @param {array} serializedTransactions - transactions that should be restored.
   * @return {TransactionsContainer} - Restored transactions container.
   */
  static deserialize(serializedTransactions) {
    const deserializedTransactions = serializedTransactions.map(
        transaction => Transaction.deserialize(transaction));
    return new TransactionsContainer(deserializedTransactions);
  }
}


module.exports = TransactionsContainer;
