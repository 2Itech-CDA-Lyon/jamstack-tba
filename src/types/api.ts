import { FaunaEntity } from "./fauna";

export type Room = FaunaEntity<{
  name: string;
  description: string;
  connectionsFrom?: RoomConnection[];
}>

export type Direction = FaunaEntity<{
  name: string;
  command: string;
}>

export type RoomConnection = FaunaEntity<{
  fromRoom: Room;
  toRoom: Room;
  direction: Direction;
}>
