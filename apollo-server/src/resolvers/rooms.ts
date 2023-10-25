import { dbClient, dbCollections, readAllDocuments, readOneDocumentByIndex } from '../db.js'
import { IRoom } from './types.js'
const collectionName = dbCollections.rooms.name;

async function readAllRooms(): Promise<IRoom[] | null> {
    return await readAllDocuments<IRoom>(collectionName);
}

async function readRoomByRoomNum(roomNumber: string): Promise<IRoom | null> {
    return await readOneDocumentByIndex(collectionName, { roomNumber: roomNumber });;
}
const RoomsQuery = {
    Query: {
        rooms: async () => { return await readAllRooms() },
        room: async (parent, args, context, info) => {
            const { roomNumber } = args;
            return await readRoomByRoomNum(roomNumber);
        }
    },
    Children: {

    }

}
const RoomsCRUD = {
    readAllRooms,
    readRoomByRoomNum
}
export { RoomsQuery, RoomsCRUD };
