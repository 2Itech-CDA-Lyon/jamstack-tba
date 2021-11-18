import { FaunaEntity } from "./fauna";

export type User = FaunaEntity<{
  firstName: string;
  lastName: string;
  email: string;
}>
