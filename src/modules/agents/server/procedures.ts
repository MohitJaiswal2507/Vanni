import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/db";
import { agents } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { agentsInsertSchema } from "../schemas";

// Router for all agent related api
export const agentsRouter = createTRPCRouter({

  // Get a single agent using its id
  getOne: protectedProcedure
    // Validate the input
    .input(z.object({ id: z.string() }))

    // Query is used to fetch data
    .query(async ({ input }) => {

      // Find the agent with the given id
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id))

      return existingAgent;
    }),

  // Fetch all agents
  getMany: protectedProcedure
    .query(async () => {

      const data = await db
        .select()
        .from(agents);

      return data;
    }),

  // Create a new agent
  create: protectedProcedure
    // Validate request body
    .input(agentsInsertSchema)

    // Mutation is used when data is modified
    .mutation(async ({ input, ctx }) => {

      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,

          // Associate the agent with the logged-in user
          userId: ctx.auth.user.id,
        })

        // Return the inserted row
        .returning();

      return createdAgent;
    }),
});