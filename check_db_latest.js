const { MongoClient } = require('mongodb');

async function run() {
  const uri = 'mongodb+srv://amar_mistri:UU12F2OMxKBNoxG9@cluster0.gzsxdbe.mongodb.net/?appName=Cluster0';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('amar_mistri');
    const mistris = await db.collection('mechanics').find().sort({ _id: -1 }).limit(3).toArray();
    mistris.forEach(m => console.log(`${m.mistriId} - ${m.createdAt} - district: ${m.district}, thana: ${m.thana}`));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
