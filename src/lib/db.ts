import { MongoClient, ServerApiVersion, Db } from 'mongodb';

if (!process.env.MONGODB_PASS) {
  console.warn('Warning: MONGODB_PASS is missing in environment variables.');
}

const uri = `mongodb+srv://amar_mistri:${process.env.MONGODB_PASS || 'UU12F2OMxKBNoxG9'}@cluster0.gzsxdbe.mongodb.net/?appName=Cluster0`;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

export async function getDB(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db('amar_mistri');
}

export default clientPromise;
