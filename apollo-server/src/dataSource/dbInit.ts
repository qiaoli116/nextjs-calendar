import { exit } from 'process';
import { dbName, dbClient, dbCollections } from '../db.js'
import teachers from './teachers.js';
import subjects from './subjects.js';
import rooms from './rooms.js';
import tas from './tas.js';
import sessions from './sessions.js';
import qualificatoins from './qualifications.js';

await dbClient.connect();
console.log('Connected to MongoDB');
const db = dbClient.db(dbName);

async function initCollection(collectionName: string, index: {}, documents: any[]) {
    console.log(`### Initializing collection ${collectionName}`)
    const collection = db.collection(collectionName);
    try {
        console.log(`    Dropping collection`)
        await collection.drop();
    }
    catch (e) {
        console.log(e);
    }

    try {
        console.log(`    Creating collection ${collectionName}`)
        await db.createCollection(collectionName);
        console.log(`    Creating index`)
        await collection.createIndex(index, { unique: true, collation: { locale: 'en', strength: 2 } });
        console.log
        await collection.insertMany(documents);
        console.log(`    Initialization successfull`)
    }
    catch (e) {
        console.log(e);
    }

}

await initCollection(dbCollections.teachers.name, dbCollections.teachers.index, teachers);
await initCollection(dbCollections.subjects.name, dbCollections.subjects.index, subjects);
await initCollection(dbCollections.rooms.name, dbCollections.rooms.index, rooms);
await initCollection(dbCollections.tas.name, dbCollections.tas.index, tas);
await initCollection(dbCollections.sessions.name, dbCollections.sessions.index, sessions);
await initCollection(dbCollections.qualifications.name, dbCollections.qualifications.index, qualificatoins);

await dbClient.close();


exit(0);