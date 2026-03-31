module.exports = {
  alias: { fd: 'docs: 修正文档笔误' },
  messages: {
    type: '选择提交类型：',
    scope: '选择影响范围（可选）：',
    customScope: '请输入自定义范围：',
    subject: '填写简短变更描述：\n',
    body: '填写详细说明（可选），使用 "|" 换行：\n',
    breaking: '列举破坏性变更（可选），使用 "|" 换行：\n',
    footerPrefixesSelect: '选择 Issue 关联前缀（可选）：',
    customFooterPrefix: '输入自定义 Issue 前缀：',
    footer: '列举关联 Issue（可选），例如 #31：\n',
    confirmCommit: '确认提交或修改 Commit？'
  },
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      缺陷修复' },
    { value: 'docs', name: 'docs:     文档' },
    { value: 'style', name: 'style:    格式（不影响代码含义）' },
    { value: 'refactor', name: 'refactor: 重构' },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     测试' },
    { value: 'build', name: 'build:    构建或依赖' },
    { value: 'ci', name: 'ci:       持续集成' },
    { value: 'revert', name: 'revert:   回退提交' },
    { value: 'chore', name: 'chore:    杂项（未改业务源码）' }
  ],
  useEmoji: true,
  emojiAlign: 'center',
  allowCustomScopes: true,
  allowEmptyScopes: true,
  customScopesAlias: '自定义',
  emptyScopesAlias: '无',
  allowBreakingChanges: ['feat', 'fix'],
  breaklineChar: '|',
  issuePrefixes: [
    { value: 'closed', name: 'closed:   已关闭的 Issue' },
    { value: 'fixes', name: 'fixes:    修复' },
    { value: 'refs', name: 'refs:     引用' }
  ],
  emptyIssuePrefixAlias: '跳过',
  customIssuePrefixAlias: '自定义',
  allowCustomIssuePrefix: true,
  allowEmptyIssuePrefix: true,
  confirmColorize: true
};
