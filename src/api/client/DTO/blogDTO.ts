import type { BaseDTO } from './baseDTO';

/** 与后端 BlogPostStatus 一致：0 草稿，1 已发布 */
export enum BlogPostStatus {
  Draft = 0,
  Published = 1
}

export interface BlogCategory {
  id: number;
  name: string;
  description?: string | null;
  sort: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  description?: string | null;
  sort: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  categoryId: number;
  category?: BlogCategory;
  tags?: BlogTag[];
  status: BlogPostStatus;
  publishedAt?: string | null;
  isPinned: boolean | number;
  viewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostListResult {
  list: BlogPost[];
  page: number;
  size: number;
  total: number;
}

export interface BlogPostListQuery {
  page?: number;
  size?: number;
  status?: BlogPostStatus;
  categoryId?: number;
  tagId?: number;
  keyword?: string;
}

export interface CreateBlogPostBody {
  title: string;
  content: string;
  categoryId: number;
  summary?: string;
  coverImage?: string;
  tagIds?: number[];
  status?: BlogPostStatus;
  isPinned?: number;
}

export interface UpdateBlogPostBody {
  id: number;
  title?: string;
  content?: string;
  categoryId?: number;
  summary?: string;
  coverImage?: string;
  tagIds?: number[];
  status?: BlogPostStatus;
  isPinned?: number;
}

export interface CreateBlogCategoryBody {
  name: string;
  description?: string;
  sort?: number;
}

export interface UpdateBlogCategoryBody {
  id: number;
  name?: string;
  description?: string;
  sort?: number;
}

export interface CreateBlogTagBody {
  name: string;
  description?: string;
  sort?: number;
}

export interface UpdateBlogTagBody {
  id: number;
  name?: string;
  description?: string;
  sort?: number;
}

export type BlogCategoryListDTO = BaseDTO<BlogCategory[]>;
export type BlogTagListDTO = BaseDTO<BlogTag[]>;
export type BlogCategoryDetailDTO = BaseDTO<BlogCategory>;
export type BlogTagDetailDTO = BaseDTO<BlogTag>;
export type BlogPostListDTO = BaseDTO<BlogPostListResult>;
export type BlogPostDetailDTO = BaseDTO<BlogPost>;
export type BlogPostMutationDTO = BaseDTO<BlogPost>;
export type BlogPostDeleteDTO = BaseDTO<{ deletedId: number }>;
export type BlogCategoryMutationDTO = BaseDTO<BlogCategory>;
export type BlogCategoryDeleteDTO = BaseDTO<{ deletedId: number }>;
export type BlogTagMutationDTO = BaseDTO<BlogTag>;
export type BlogTagDeleteDTO = BaseDTO<{ deletedId: number }>;
