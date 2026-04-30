/**
 * 历程与归档：站点的「改版日记」时间线。
 *
 * 怎么用：
 * - 每次有意义的上线、改版、迁移主题/服务器等，在这里加一条；
 * - `title` 写时间或版本（如 2026-04、v2 导航重构）；
 * - `description` 用一两句话写做了什么，方便以后的自己和访客快速了解演进。
 *
 * 数组顺序：建议「新的在上」（首条是最新动态），页面会按数组顺序渲染。
 */
export interface AboutTimelineEntry {
  title: string;
  description: string;
}

export const aboutTimeline: AboutTimelineEntry[] = [
  {
    title: '2021-04-05 上线',
    description: '暂不公开'
  }
];
