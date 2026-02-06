import { Button } from './button';
import { Callout } from './callout';
import { MediaCard } from './media-card';
import { Table } from './table';

export const componentRegistry = {
  Button,
  Callout,
  MediaCard,
  Table,
} as const;

export type ComponentName = keyof typeof componentRegistry;
