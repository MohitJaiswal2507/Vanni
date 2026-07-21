import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';

import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';


export const createTRPCContext = cache(async () => {
  // Create context for every tRPC request
  return { userId: 'user_123' };
});

// Initializing tRPC
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Base procedure that anyone can access
export const baseProcedure = t.procedure;
// Middleware to allow only logged-in users
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // Get the current logged-in session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Stop the request if user is not logged in
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  // Add session data to the context
  return next({ ctx: { ...ctx, auth: session } });
})

// Middleware to check premium access and free limits
export const premiumProcedure = (entity: "meetings" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    // Get customer details from Polar
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    // Counting how many meetings this user has
    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));
    
    // Count how many agents this user has
    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));
    
    // Check if user has an active premium subscription
    const isPremium = customer.activeSubscriptions.length > 0;
     // Check whether free limits are reached
    const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
    const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;
    
     // Decide if request should be blocked
    const shouldThrowMeetingError =
      entity === "meetings" && isFreeMeetingLimitReached && !isPremium;
    const shouldThrowAgentError =
      entity === "agents" && isFreeAgentLimitReached && !isPremium;
    
    // Stop creating meetings if free limit is reached
    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free meetings",
      });
    }

    //this is for agents check 
    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free agents",
      });
    }
    // Continue the request and pass customer info
    return next({ ctx: { ...ctx, customer } });
  });