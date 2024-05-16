import { Timestamp } from "firebase/firestore";

type BaseRecord = {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function createBaseRecord(): BaseRecord {
  return {
    id: randomStr(12),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export type { BaseRecord };
export { createBaseRecord };
