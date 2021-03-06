import { ScullyRoute } from '@scullyio/ng-lib';

export interface TagWeight {
  tag: ScullyRoute;
  weight: number;
}

export interface SearchItem {
  title: string;
  description?: string;
  url: string;
  tag: string;
}

export enum PlausibleEvent {
  'Newsletter' = 'Newsletter',
  'Theme' = 'Theme',
  'Search' = 'Search',
}
