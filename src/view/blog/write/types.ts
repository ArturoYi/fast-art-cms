import type { BlogPostStatus } from '@/api/client';

export type WriteMetaForm = {
  title: string;
  summary: string;
  coverImage: string;
  categoryId: number | null;
  tagIds: number[];
  status: BlogPostStatus;
  isPinned: boolean;
};
