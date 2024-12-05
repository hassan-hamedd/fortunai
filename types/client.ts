import { Status } from "./status";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  taxForm: string;
  statusId: string;
  status: Status;
  assignedTo: string;
  reviewer?: string;
  lastUpdated: string;
  createdAt: string;
}
