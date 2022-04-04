import { SavedUserResult } from "./user";

export interface DBApply {
  uid: number;
  target: 'provider';
  condition: string;
  status: 'waitting' | 'pass';
}

export interface Apply {
  uid: number;
  target: 'provider';
  condition: string;
  status: 'waitting' | 'pass';
  user: SavedUserResult;
}

export default Apply;
