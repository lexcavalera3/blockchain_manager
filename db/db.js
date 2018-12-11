/**
 * Contains methods for working with database.
 */
require('rooty')();
const MongoClient = require('mongodb').MongoClient;
const BlockChain = require('^/blockchain/blockchain').BlockChain;
const db = require('^/config/config').db;
const dbUrl = `${db.host}:${db.port}/${db.name}`;

/**
 * Read blockchain from database.
 * @return {Promise} Promise with {BlockChain} of all blocks from the database.
 */
function readBlocks() {
  return new Promise(function(resolve) {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, function(err, client) {
      const database = client.db(db.name);
      const collection = database.collection(db.collectionName);
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
          const database = client.db(db.name);
          const collection = database.collection(db.collectionName);
          collection.insertOne(block.serialize());
          client.close();
          resolve(0);
        });
  });
}


module.exports.writeBlock = writeBlock;
module.exports.readBlocks = readBlocks;
