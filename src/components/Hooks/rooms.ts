import { gql, useQuery, useMutation, CombinedError, UseMutationExecute } from 'urql';
import { IRoom } from "../../types"

export function useQueryRooms() {
    const ROOMS_QUERY = gql`
        query Rooms {
            rooms {
                roomNumber
                type
            }
        }
    `;

    const [result, executeQuery] = useQuery<{ rooms: IRoom[] } | undefined | null>({ query: ROOMS_QUERY });
    const { data, fetching: loading, error } = result;
    const dataError =
        data === undefined ||
        data === null ||
        data.rooms === undefined ||
        data.rooms === null ||
        !Array.isArray(data.rooms);

    return {
        loading,
        error,
        dataError,
        rooms: dataError ? [] : data.rooms,
        reexecuteQueryRooms: executeQuery,
    };
}

export function useQueryOneRoom(roomNumber: string) {
    const ROOM_QUERY = gql`
        query Room($roomNumber: String) {
            room(roomNumber: $roomNumber) {
                roomNumber
                type
            }
        }
    `;

    const [result, executeQuery] = useQuery<{ room: IRoom } | undefined | null>({
        query: ROOM_QUERY,
        variables: { roomNumber },
    });
    const { data, fetching: loading, error } = result;
    const dataError =
        data === undefined ||
        data === null ||
        data.room === undefined ||
        data.room === null;

    return {
        loading,
        error,
        dataError,
        room: dataError ? null : data.room,
        reexecuteQueryRoom: executeQuery,
    };
}

export interface ICreateRoomMutationVariables {
    roomNumber: string;
    type: string;
}
type CreateRoomMutationData = { roomCreate: IRoom } | undefined | null;
export function useMutationCreateRoom(): [UseMutationExecute<CreateRoomMutationData, ICreateRoomMutationVariables>] {
    const ROOM_CREATE_MUTATION = gql`
        mutation RoomCreate($roomNumber: String, $type: String) {
            roomCreate(roomNumber: $roomNumber, type: $type) {
                roomNumber
                type
            }`
    const [result, executeMutation] = useMutation<CreateRoomMutationData, ICreateRoomMutationVariables>(ROOM_CREATE_MUTATION);
    return [executeMutation];
}

export interface IUpdateRoomMutationVariables {
    roomNumber: string;
    type: string;
}
type UpdateRoomMutationData = { roomUpdate: IRoom } | undefined | null;
export function useMutationUpdateRoom() {
    const ROOM_UPDATE_MUTATION = gql`
        mutation RoomUpdate($roomNumber: String, $type: String) {
            roomUpdate(roomNumber: $roomNumber, type: $type) {
                roomNumber
                type
            }`
    const [result, executeMutation] = useMutation<UpdateRoomMutationData, IUpdateRoomMutationVariables>(ROOM_UPDATE_MUTATION);
    return [executeMutation];
}

export interface IDeleteRoomMutationVariables {
    roomNumber: string;
}
type DeleteRoomMutationData = { roomDelete: IRoom } | undefined | null;
export function useMutationDeleteRoom() {
    const ROOM_DELETE_MUTATION = gql`
        mutation RoomDelete($roomNumber: String) {
            roomDelete(roomNumber: $roomNumber) {
                roomNumber
                type
            }`
    const [result, executeMutation] = useMutation<DeleteRoomMutationData, IDeleteRoomMutationVariables>(ROOM_DELETE_MUTATION);
    return [executeMutation];
}