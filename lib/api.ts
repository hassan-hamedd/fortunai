import { NextResponse } from 'next/server';

export const fetchClients = async () => {
  const response = await fetch('/api/clients');
  if (!response.ok) throw new Error('Failed to fetch clients');
  return response.json();
};

export const createClient = async (clientData) => {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error('Failed to create client');
  return response.json();
}; 