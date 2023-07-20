import fetch from 'isomorphic-unfetch'

export async function fetchSession() {
  const response = await fetch('http://localhost:3000/api/session');
  const sessionData = await response.json();
  return sessionData;
};