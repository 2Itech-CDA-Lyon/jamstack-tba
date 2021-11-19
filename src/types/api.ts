import { FaunaEntity } from "./fauna";

export type Room = FaunaEntity<{
  name: string;
  description: string;
}>
