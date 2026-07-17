import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { agents } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

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
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;
      const data = await db
        .select({
          // TODO: Change to actual count
          meetingCount: sql<number>`6`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
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