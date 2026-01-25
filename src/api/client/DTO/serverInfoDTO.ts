import type { BaseDTO } from './baseDTO';

/**
 * 运行时信息
 */
export interface Runtime {
  /** 操作系统 */
  os?: string;
  /** 架构 */
  arch?: string;
  /** Node.js 版本 */
  nodeVersion?: string;
  /** npm 版本 */
  npmVersion?: string;
}

/**
 * CPU 核心负载
 */
export interface CoreLoad {
  /** 原始负载 */
  rawLoad?: number;
  /** 原始空闲负载 */
  rawLoadIdle?: number;
}

/**
 * CPU 信息
 * Intel(R) Xeon(R) Platinum 8163 CPU @ 2.50GHz
 */
export interface Cpu {
  /** 制造商 */
  manufacturer?: string;
  /** 品牌 */
  brand?: string;
  /** 物理核心数 */
  physicalCores?: number;
  /** 型号 */
  model?: string;
  /** 速度 */
  speed?: number;
  /** 原始当前负载 */
  rawCurrentLoad?: number;
  /** 原始当前空闲负载 */
  rawCurrentLoadIdle?: number;
  /** 核心负载数组 */
  coresLoad?: CoreLoad[];
}

/**
 * 磁盘信息
 */
export interface Disk {
  /** 总大小 */
  size?: number;
  /** 已使用 */
  used?: number;
  /** 可用空间 */
  available?: number;
}

/**
 * 内存信息
 */
export interface Memory {
  /** 总内存 */
  total?: number;
  /** 可用内存 */
  available?: number;
}

/**
 * 系统信息
 */
export interface ServeStatInfo {
  /** 运行时信息 */
  runtime?: Runtime;
  /** CPU 信息 */
  cpu?: Cpu;
  /** 磁盘信息 */
  disk?: Disk;
  /** 内存信息 */
  memory?: Memory;
}

/**
 * 服务器信息接口响应类型
 */
export interface ServerInfoDTO extends BaseDTO<ServeStatInfo> {}
