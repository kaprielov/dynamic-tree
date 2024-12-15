import { API_DATA_URL, API_BASE_URL } from './constants';
import { TreeNode, EntryData } from '../types';

export const fetchTreeData = async (): Promise<TreeNode[]> => {
  const response = await fetch(API_DATA_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch tree data');
  }
  return response.json();
};

export const fetchEntryData = async (id: string): Promise<EntryData | null> => {
  const url = `${API_BASE_URL}/entries/${id}.json`;
  const response = await fetch(url);
  if (response.status === 404) {
    console.warn(`Entry data not found for id: ${id}`);
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch entry data');
  }
  return response.json();
};
