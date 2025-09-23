import type { Low } from "lowdb";

// include notification data and receivers data
export interface Data {
  [id: string]: any; // id 是字符串，值可以是任意 JSON
}

export async function checkExists(db: Low<Data>, key: string): Promise<boolean> {
  await db.read();
  return db.data?.hasOwnProperty(key) ?? false;
}

export async function list(db: Low<Data>): Promise<string[]> {
  await db.read();
  return Object.keys(db.data ?? {});
}

export async function appendData(db: Low<Data>, key: string, value: any): Promise<void> {
  await db.read();
  db.data[key] = value;
  await db.write();
}
