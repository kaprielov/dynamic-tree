import type { EntryData, TreeNode } from '../types';

export const demoTree: TreeNode[] = [
  {
    label: 'Product research',
    children: [
      { id: 'interviews', label: 'Customer interviews' },
      { id: 'findings', label: 'Research findings' },
      {
        label: 'Experiments',
        children: [{ id: 'prototype', label: 'Prototype notes' }],
      },
    ],
  },
  {
    label: 'Design library',
    children: [
      { id: 'navigation', label: 'Navigation patterns' },
      { id: 'accessibility', label: 'Accessibility checklist' },
    ],
  },
  { id: 'roadmap', label: 'Release roadmap' },
];

export const demoEntries: Record<string, EntryData> = {
  interviews: {
    id: 'interviews',
    name: 'Customer interviews',
    description:
      'A synthetic research summary. Participants needed a clearer way to group related documents and move them between collections without losing context.',
  },
  findings: {
    id: 'findings',
    name: 'Research findings',
    description:
      'Keep hierarchy visible, show where an item will land, and prevent a collection from being moved into one of its own descendants.',
  },
  prototype: {
    id: 'prototype',
    name: 'Prototype notes',
    description:
      'Try dragging a document above, inside, or below another item. You can also select an item and use the movement buttons with a keyboard.',
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation patterns',
    description:
      'A nested collection supports browsing and rearranging documents. Selection stays attached to the item while its position changes.',
  },
  accessibility: {
    id: 'accessibility',
    name: 'Accessibility checklist',
    description:
      'Use Tab to reach each item and movement control. Buttons have visible focus indicators. Touch and pointer dragging use a dedicated handle.',
  },
  roadmap: {
    id: 'roadmap',
    name: 'Release roadmap',
    description:
      'This demo stores rearrangements in memory. Refresh the page or choose Reset collection to return to the original example.',
  },
};
