import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'appdb';
const dbClient = new MongoClient(url);
const dbCollections = {
    teachers: {
        name: 'teachers',
        index: { orgId: 1 },
    },
    sessions: {
        name: 'sessions',
        index: { reference: 1 },
    },
    subjects: {
        name: 'subjects',
        index: { reference: 1 },
    },
    tas: {
        name: 'tas',
        index: { year: 1, department: 1, "qualification.code": 1 },
    },
    rooms: {
        name: 'rooms',
        index: { roomNum: 1 },
    },
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

const readOneDocumentByIndex = async <T>(collectionName: string, indexQuery: object): Promise<T | null> => {
    let document = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection(collectionName); // Replace with your collection name

        const docs = await collection.find(indexQuery).toArray();
        console.log('Found documents:', docs);
        if (docs.length > 0) {
            document = docs[0];
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return document;
}

export { dbName, dbClient, dbCollections, readAllDocuments, readOneDocumentByIndex };
