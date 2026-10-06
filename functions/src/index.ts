import { initializeApp } from 'firebase-admin/app';
initializeApp();
export { bootstrapSuperAdmin, setUserAdminRole, updateSystemSetting, updateModelConfig, upsertApiSecret } from './admin';
