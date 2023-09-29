import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = getUser();

        if (!user.id || !user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

        // check if the user is in the database
        const dbUser = await db.askPDF_User.findFirst({
            where: {
                id: user.id
            }
        });

        if (!dbUser) {
            // create the user
            await db.askPDF_User.create({
                data: {
                    id: user.id,
                    email: user.email
                }
            });
        }

        return {
            success: true
        }
    }),
    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const { user, userId } = ctx;
        return await db.askPDF_File.findMany({
            where: {
                askPDF_UserId: userId
            }
        });
    }),
    getFile: privateProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx

            const file = await db.askPDF_File.findFirst({
                where: {
                    key: input.key,
                    askPDF_UserId: userId,
                },
            })

            if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

            return file
        }),
    deleteFile: privateProcedure.input(
        z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;

        const file = await db.askPDF_File.findFirst({
            where: {
                id: input.id,
                askPDF_UserId: userId
            }
        });

        if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

        await db.askPDF_File.delete({
            where: {
                id: input.id
            }
        });

        return file
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;