module.exports = {
  async up(db, client) {
    db.createCollection("user", {
      validator: { $jsonSchema: {
         bsonType: "object",
         required: [ "name", "age" ],
         properties: {
            name: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            age: {
               bsonType: "string",
               description: "must be a string and is required"
            }
         }
      }}
   })
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
