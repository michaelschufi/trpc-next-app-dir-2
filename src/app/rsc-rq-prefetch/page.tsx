import { HydrateClient, trpc } from '~/trpc/rq-server';
import React, { Suspense } from 'react';
import { Post } from './post';

export const dynamic = 'force-dynamic';

export default function Home() {
  void trpc.getLatestPost.prefetch();

  return (
    <main>
      <h1>Latest Post</h1>
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <Post />
        </Suspense>
      </HydrateClient>
    </main>
  );
}
