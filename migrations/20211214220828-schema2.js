module.exports = {
  async up(db, client) {
    db.command({
      collMod: "user",
      validator: { $jsonSchema: {
        bsonType: "object",
        required: [ "name", "age" ],
        properties: {
           name: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           age: {
              bsonType: "number",
              description: "must be a integer and is required"
           }
        }
     }},
      validationLevel: "strict"
   })
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
