export type FaunaId = string;

export interface FaunaRef {
  '@ref': {
    id: FaunaId;
    collection?: FaunaRef;
  }
}

export interface FaunaEntity<T> {
  ref: FaunaRef;
  ts: number;
  data: T;
}
