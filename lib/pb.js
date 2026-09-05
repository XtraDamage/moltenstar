import PocketBase from 'pocketbase';
import { getSettings } from './storage';

let pb = null;

export function getPB() {
  if (typeof window !== 'undefined' && !pb) {
    const settings = getSettings();
    if (settings.pbUrl) {
      pb = new PocketBase(settings.pbUrl);
    }
  }
  return pb;
}

export function setPBUrl(url) {
  if (typeof window !== 'undefined') {
    pb = new PocketBase(url);
  }
  return pb;
}

export async function login(email, password) {
  const client = getPB();
  if (!client) throw new Error('Server URL not configured');
  return await client.collection('users').authWithPassword(email, password);
}

export async function register(email, password) {
  const client = getPB();
  if (!client) throw new Error('Server URL not configured');
  await client.collection('users').create({
    email,
    password,
    passwordConfirm: password
  });
  return await login(email, password);
}

export function logout() {
  const client = getPB();
  if (client) {
    client.authStore.clear();
  }
}

export function isAuthenticated() {
  const client = getPB();
  return client?.authStore?.isValid || false;
}

export function getUser() {
  const client = getPB();
  return client?.authStore?.model || null;
}
