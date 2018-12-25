const Transaction = require('blockchain/models/transaction');
const TransactionsContainer = require('blockchain/models/transactions_container');

/**
 * Responsible for operations with thansactions.
 */
class TransactionsController {
  /**
   * Initializes transactions container.
   */
  constructor() {
    this._transactionsContainer = new TransactionsContainer();
  }

  /**
   * Get serialized transactions from container.
   * @return {Array} - serialized transactions.
   */
  get transactions() {
    return this._transactionsContainer.serialize();
  }

  /**
   * Clear transactions container.
   */
  clearTransactions() {
    this._transactionsContainer.clearTransactions();
  }

  /**
   * Create transaction with given data
   * @param {string} from - from address
   * @param {string} to - to address
   * @param {number} amount - amount of transferred coins
   * @return {object} - new serialized transaction
   */
  createTransaction(from, to, amount) {
    const newTransaction = new Transaction(from, to, amount);
    this._transactionsContainer.addTransaction(newTransaction);
    return newTransaction.serialize();
  }

  /**
   * Create mine transaction for given miner address
   * @param {string} minerAddress - address of miner
   * @return {object} - new serialized mine transaction
   */
  createMineTransaction(minerAddress) {
    const newTransaction = Transaction.createMineTransaction(minerAddress);
    this._transactionsContainer.addTransaction(newTransaction);
    return newTransaction.serialize();
  }

  /**
   * Calculate balance of coins for given address according to given transactions.
   * @param {array} transactions
   * @param {string} address - address, which balance is calculated.
   * @return {number} - balance on the address.
   */
  static getBalance(transactions, address) {
    const amountGatherer = (balance, transaction) => {
      if (transaction.from === address) {
        balance -= transaction.amount;
      }
      if (transaction.to === address) {
        balance += transaction.amount;
      }
      return balance;
    };
    return transactions.reduce(amountGatherer, 0);
  }
}


module.exports = TransactionsController;
