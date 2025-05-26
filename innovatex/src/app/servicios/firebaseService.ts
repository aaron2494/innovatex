import { Injectable, inject } from '@angular/core';
import { getFirestore, doc, getDoc, setDoc, Firestore } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class FirebaseService {
 private db: Firestore;

  constructor() {
    this.db = inject(Firestore); // ✅ usa Angular DI (espera a initializeApp)
  }

  async getUserPlan(email: string): Promise<string | null> {
    const docRef = doc(this.db, 'usuarios', email);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data()['plan'] : null;
  }

  async saveUserPlan(email: string, plan: string) {
    const docRef = doc(this.db, 'usuarios', email);
    return setDoc(docRef, { plan, paid: true }, { merge: true });
  }
}