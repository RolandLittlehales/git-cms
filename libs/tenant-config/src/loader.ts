import * as fs from 'fs';
import * as path from 'path';
import type { TenantConfig } from './types';
import { findWorkspaceRoot } from './workspace';

const CONTENT_DIR = path.join(findWorkspaceRoot(), 'content');

export function getTenantConfig(tenantId: string): TenantConfig | null {
  const configPath = path.resolve(CONTENT_DIR, tenantId, 'config.json');
  if (!configPath.startsWith(path.resolve(CONTENT_DIR))) {
    return null;
  }

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as TenantConfig;
  } catch {
    return null;
  }
}

export function getAllTenantIds(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const configPath = path.join(CONTENT_DIR, entry.name, 'config.json');
      return fs.existsSync(configPath);
    })
    .map((entry) => entry.name);
}
