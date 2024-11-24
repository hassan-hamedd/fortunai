import { Client } from "./client";

export interface Column {
  id: string;
  title: string;
  clients: Client[];
}

export interface Status {
  id: string;
  title: string;
}
