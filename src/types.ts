export interface TreeNode {
  id?: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeNodeWithId extends TreeNode {
  elementId: string;
  children?: TreeNodeWithId[];
}

export interface EntryData {
  id: string;
  name: string;
  description?: string;
}
