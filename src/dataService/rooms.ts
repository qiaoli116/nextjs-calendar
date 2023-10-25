import Rooms from "../jsonDb/rooms"
import { sleep } from "./utils";

export interface IRoom {
    roomNumber: string;
    type: string;
}

const getAllRooms = async (): Promise<IRoom[]> => {
    await sleep(1e3); // For demo purposes.
    return Rooms;
}

const getOneRoomByRoomNum = async (roomNumber: string): Promise<IRoom | undefined> => {
    return Rooms.find((room) => room.roomNumber === roomNumber);
}

export default {
    getAllRooms,
    getOneRoomByRoomNum
}