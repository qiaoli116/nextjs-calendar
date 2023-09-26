import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'appdb';
const dbClient = new MongoClient(url);
const dbCollections = {
    teachers: 'teachers',
    sessions: 'sessions',
    subjects: 'subjects',
    tas: 'tas',
    rooms: 'rooms',
};

const readAllDocuments = async <T>(collectionName: string, query: any = {}): Promise<T[] | null> => {
    let documents = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db(dbName);
        const collection = db.collection(collectionName);

        const docs = await collection.find({}).toArray();
        console.log('Found documents:', docs);
        documents = docs;
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return documents;
}

export { dbName, dbClient, dbCollections, readAllDocuments };
