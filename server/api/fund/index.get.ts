import {PrismaClient} from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const take = typeof query.take == "number" ? query.take : 10;
    if (take > 25)
        throw createError({
            status: 400,
            statusMessage: "Cannot load more than 25"
        });
    const skip = typeof query.skip == "number" ? query.skip : 0;
    return prismaClient.fund.findMany({skip: skip, take: take});
});