import { agentsRouter } from '@/modules/agents/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';

import { createTRPCRouter } from '../init';

// Combine all feature routers here
export const appRouter = createTRPCRouter({
   // Routes for agents (create, update, delete, etc.)
  agents: agentsRouter,
  meetings: meetingsRouter,
});
// Used by frontend for autocomplete and type checking
export type AppRouter = typeof appRouter;