/**
 * Transactions store information about creation and transition of Wind Coins.
 */
class Transaction {
  /**
   * @param {string} from - Address of the sender.
   * @param {string} to - Address of the receiver.
   * @param {number/string} amount - Amount of transited coins.
   */
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = Number(amount);
  }

  /**
   * Converts Transaction to object.
   * @return {object} - Serialized transaction.
   */
  serialize() {
    return {
      from: this.from,
      to: this.to,
      amount: this.amount
    };
  }

  /**
   * Restores Transaction from object.
   * @param {object} serializedTransaction - serialized transaction.
   * @return {Transaction} - Restored transaction.
   */
  static deserialize(serializedTransaction) {
    return new Transaction(
        serializedTransaction.from,
        serializedTransaction.to,
        serializedTransaction.amount
    );
  }

  /**
   * Generates mine transaction - create 1 Wind Coin..
   * @param {string} minerAddress - Address of the miner (receiver).
   * @return {Transaction} New mine transaction.
   */
  static createMineTransaction(minerAddress) {
    return new Transaction('Network', minerAddress, 1);
  }
}


module.exports = Transaction;
