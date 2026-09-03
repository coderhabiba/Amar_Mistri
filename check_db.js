const { MongoClient } = require('mongodb');

async function run() {
  const uri = 'mongodb+srv://amar_mistri:UU12F2OMxKBNoxG9@cluster0.gzsxdbe.mongodb.net/?appName=Cluster0';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('amar_mistri');
    const mistri = await db.collection('mechanics').find().sort({ _id: -1 }).limit(1).toArray();
    console.log(JSON.stringify(mistri, null, 2));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
