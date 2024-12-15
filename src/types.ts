export interface TreeNode {
  id?: string;
  label: string;
  children?: TreeNode[];
}

export interface EntryData {
  id: string;
  name: string;
  description?: string;
}
