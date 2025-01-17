import { Temporal } from '@js-temporal/polyfill';
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function getUrl() {
  return getBaseUrl() + '/api/trpc';
}

superjson.registerCustom(
  {
    isApplicable: (v): v is Temporal.PlainDate =>
      v instanceof Temporal.PlainDate,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => Temporal.PlainDate.from(v),
  },
  'Temporal.PlainDate',
);

superjson.registerCustom(
  {
    isApplicable: (v): v is Temporal.PlainDateTime =>
      v instanceof Temporal.PlainDateTime,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => Temporal.PlainDateTime.from(v),
  },
  'Temporal.PlainDateTime',
);

export const transformer = superjson;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Since queries are prefetched on the server, we set a stale time so that
        // queries aren't immediately refetched on the client
        staleTime: 1000 * 30,
      },
      dehydrate: {
        // include pending queries in dehydration
        // this allows us to prefetch in RSC and
        // send promises over the RSC boundary
        serializeData: transformer.serialize,
      },
      hydrate: {
        // when the promise has resolved, deserialize the data
        // since trpc will serialize it on the server. this
        // allows you to return Date, Temporal etc from your
        // procedure and have that auto-serialize on the client
        deserializeData: transformer.deserialize,
      },
    },
  });
