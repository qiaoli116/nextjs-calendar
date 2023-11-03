import { BlobOptions } from 'buffer';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

console.log("process.env.DB_STRING", process.env.DB_STRING)
const url = process.env.DB_STRING ? process.env.DB_STRING : 'mongodb://localhost:27017';
console.log("url is set to", url)
const dbName = 'appdb';
const dbClient = new MongoClient(url);
const collationCaseInsensitive = { locale: 'en', strength: 2 }
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
        index: { roomNumber: 1 },
    },
    qualifications: {
        name: 'qualifications',
        index: { code: 1 },
    }
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
        console.log('Connected to MongoDB, ', collectionName, indexQuery);

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection(collectionName); // Replace with your collection name

        const docs = await collection.find(indexQuery).collation(collationCaseInsensitive).toArray();
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

const readOneDocumentById = async <T>(collectionName: string, id): Promise<T | null> => {
    let document = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb');
        const collection = db.collection(collectionName);
        const indexQuery = { _id: new ObjectId(id) };
        const docs = await collection.find(indexQuery).collation(collationCaseInsensitive).toArray();
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

const insertOneDocument = async <T>(collectionName: string, document: T): Promise<T | null> => {
    let documentCreated = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb');
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(document);
        console.log('Inserted result:', result);
        if (result.insertedId) {
            const indexQuery = { _id: new ObjectId(result.insertedId) };
            const docs = await collection.find(indexQuery).collation(collationCaseInsensitive).toArray();
            console.log('Found documents:', docs);
            if (docs.length > 0) {
                documentCreated = docs[0];
            }
            console.log('Inserted document:', documentCreated);
        }
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return documentCreated;
}

const updateOneDocument = async <T>(collectionName: string, indexQuery: object, update: object, options: object = {}): Promise<T | null> => {
    console.log('Update query:')
    console.log("collectionName", collectionName)
    console.log("indexQuery", indexQuery)
    console.log("updates", update)
    let documentUpdated = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb');
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(indexQuery, update, { ...options, collation: collationCaseInsensitive });
        console.log('Update result:', result);
        if (result.modifiedCount == 1) {
            const docs = await collection.find(indexQuery).collation(collationCaseInsensitive).toArray();
            console.log('Found documents:', docs);
            if (docs.length > 0) {
                documentUpdated = docs[0];
            }
            console.log('Update document:', documentUpdated);
        }
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return documentUpdated;
}

const deleteOneDocumentByIndex = async (collectionName: string, indexQuery: object): Promise<boolean> => {
    let result: boolean = false;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection(collectionName); // Replace with your collection name

        const deleteOneResult = await collection.deleteOne(indexQuery, { collation: collationCaseInsensitive });
        console.log('Delete documents:', deleteOneResult);
        if (deleteOneResult.deletedCount == 1) {
            result = true;
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return result;
}




export {
    dbName,
    dbClient,
    dbCollections,
    readAllDocuments,
    readOneDocumentByIndex,
    readOneDocumentById,
    insertOneDocument,
    updateOneDocument as udpateOneDocument,
    deleteOneDocumentByIndex,
    collationCaseInsensitive,

};
