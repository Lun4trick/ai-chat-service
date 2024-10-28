import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 } from 'uuid';

@Injectable()
export class DatabaseService {
  private realtimeDB: admin.database.Database;
  private firestoreDB: admin.firestore.Firestore;

  constructor() {
    const app = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.SERVICE_ACCOUNT_JSON),
      ),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    this.realtimeDB = app.database();
    this.firestoreDB = app.firestore();
  }

  writeDataToFirestore(collection: string, data: any) {
    try {
      const newEntityId = v4();
      this.firestoreDB.collection(collection).doc(newEntityId).set(data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFirestoreDB() {
    try {
      return this.firestoreDB;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRealtimeDB() {
    try {
      return this.realtimeDB;
    } catch (error) {
      throw new Error(error);
    }
  }
}
