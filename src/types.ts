export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
  isTypingDone?: boolean;
  searchSources?: { title: string; uri: string }[];
}

export interface ChatSession {
  id: string;
  name: string;
  createdAt: number;
}

export interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

