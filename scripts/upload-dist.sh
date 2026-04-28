#!/usr/bin/env bash
# CMS 一键打包并上传 dist 到服务器
#
# 依赖：
# - 本地：pnpm（用于执行 build:prod）
# - 上传：rsync + ssh（推荐走 SSH Key 免密）
# - 可选：sshpass（如需用密码：brew install sshpass；并 export SSHPASS='你的密码'）
#
# 用法示例：
#   1) 免密（推荐）：
#        DEPLOY_HOST=1.2.3.4 ./scripts/upload-dist.sh
#   2) 指定用户/端口：
#        DEPLOY_HOST=1.2.3.4 DEPLOY_USER=root SSH_PORT=22 ./scripts/upload-dist.sh
#   3) 使用密码（不推荐，需 sshpass）：
#        export SSHPASS='你的密码'
#        DEPLOY_HOST=1.2.3.4 ./scripts/upload-dist.sh
#
# 可覆盖变量：
#   DEPLOY_HOST    服务器地址（必填）
#   DEPLOY_USER    服务器用户（默认 root）
#   SSH_PORT       ssh 端口（默认 22）
#   REMOTE_DIST    远端 dist 目录（默认 /var/www/fast-art-cms/dist）
#   LOCAL_DIST     本地 dist 目录（默认 dist）
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPLOY_HOST="${DEPLOY_HOST:-45.205.28.134}"
DEPLOY_USER="${DEPLOY_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_DIST="${REMOTE_DIST:-/var/www/fast-art-cms/dist}"
LOCAL_DIST="${LOCAL_DIST:-dist}"

if [[ -z "$DEPLOY_HOST" ]]; then
  echo "错误: 未设置 DEPLOY_HOST，例如：DEPLOY_HOST=1.2.3.4 ./scripts/upload-dist.sh" >&2
  exit 1
fi

ssh_exec() {
  if command -v sshpass >/dev/null 2>&1 && [[ -n "${SSHPASS:-}" ]]; then
    sshpass -e ssh -p "$SSH_PORT" -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=~/.ssh/known_hosts \
      "$DEPLOY_USER@$DEPLOY_HOST" "$@"
  else
    ssh -p "$SSH_PORT" -o StrictHostKeyChecking=accept-new \
      "$DEPLOY_USER@$DEPLOY_HOST" "$@"
  fi
}

rsync_upload() {
  local target="${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_DIST}/"
  local ssh_cmd="ssh -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new"
  if command -v sshpass >/dev/null 2>&1 && [[ -n "${SSHPASS:-}" ]]; then
    sshpass -e rsync -avz --delete --progress -e "$ssh_cmd" \
      "${LOCAL_DIST}/" "$target"
  else
    rsync -avz --delete --progress -e "$ssh_cmd" \
      "${LOCAL_DIST}/" "$target"
  fi
}

echo "==> 本地打包: pnpm run build:prod"
pnpm run build:prod

if [[ ! -d "$LOCAL_DIST" ]]; then
  echo "错误: 未找到 ${LOCAL_DIST}/（打包后应生成该目录）" >&2
  exit 1
fi

echo "==> 远端删除并重建: ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_DIST}"
ssh_exec "rm -rf '${REMOTE_DIST}' && mkdir -p '$(dirname "${REMOTE_DIST}")' && mkdir -p '${REMOTE_DIST}'"

echo "==> 上传: ${LOCAL_DIST}/ -> ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_DIST}/"
rsync_upload

echo "==> 完成。"
