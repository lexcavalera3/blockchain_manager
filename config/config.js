config = {
  blockchain: {
    defaultMinerAddress: 'Some valid miner address'
  },
  db: {
    host: 'mongodb://localhost',
    port: '27017',
    name: 'blockchain',
    collectionName: 'blocks'
  }
};

module.exports = config;
