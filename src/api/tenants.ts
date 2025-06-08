import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const getTenants = async () => {
  const tenantsCol = collection(db, 'tenants');
  const tenantSnapshot = await getDocs(tenantsCol);
  return tenantSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addTenant = async (tenantData: any) => {
  const tenantsCol = collection(db, 'tenants');
  return await addDoc(tenantsCol, tenantData);
};
