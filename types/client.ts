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
  lastUpdated: string;
  createdAt: string;
}
