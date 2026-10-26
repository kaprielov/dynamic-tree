import { demoEntries, demoTree } from './demo';
import type { EntryData, TreeNode } from '../types';

export const fetchTreeData = async (): Promise<TreeNode[]> =>
  structuredClone(demoTree);
export const fetchEntryData = async (id: string): Promise<EntryData | null> =>
  demoEntries[id] ? { ...demoEntries[id] } : null;
