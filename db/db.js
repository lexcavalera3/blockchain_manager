/**
 * Contains methods for working with database.
 */
const MongoClient = require('mongodb').MongoClient;
const BlockChain = require('blockchain/blockchain');
const dbConfig = require('config/config').db;
const dbUrl = `${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

/**
 * Read blockchain from database.
 * @return {Promise} Promise with {BlockChain} of all blocks from the database.
 */
function readBlocks() {
  return new Promise(function(resolve) {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, function(err, client) {
      const database = client.db(dbConfig.name);
      const collection = database.collection(dbConfig.collectionName);
      collection.find().toArray(function(err, blocks) {
        client.close();
        resolve(BlockChain.restoreFromBlocks(blocks));
      });
    });
  });
}

/**
 * Write Block into database.
 * @param {Block} block - Block to be written.
 * @return {Promise} - Promise that block is written to db.
 */
function writeBlock(block) {
  return new Promise(function(resolve) {
    MongoClient.connect(
        dbUrl, {useNewUrlParser: true}, function(err, client) {
          const database = client.db(dbConfig.name);
          const collection = database.collection(dbConfig.collectionName);
          collection.insertOne(block.serialize());
          client.close();
          resolve(0);
        });
  });
}


module.exports = {writeBlock, readBlocks};
