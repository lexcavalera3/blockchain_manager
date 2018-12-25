config = {
  blockchain: {
    minerAddress: 'Some valid miner address',
    applicationPort: 3000,
    amountOfWork: 8
  },
  db: {
    host: 'mongodb://localhost',
    port: '27017',
    name: 'blockchain',
    collectionName: 'blocks'
  }
};

module.exports = config;
