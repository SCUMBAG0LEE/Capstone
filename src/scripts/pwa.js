// src/scripts/service-worker.js

export default async function ensureServiceWorkerRegistered() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers are not supported in this browser.');
    return null;
  }

  try {
    // Check if already registered
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      console.log('✅ Service Worker already registered:', existingRegistration.scope);
      return existingRegistration;
    }

    // Register new service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ New Service Worker registered:', registration.scope);
    return registration;
  } catch (err) {
    console.error('❌ Failed to register Service Worker:', err);
    return null;
  }
}
