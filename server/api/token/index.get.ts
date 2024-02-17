import {PrismaClient} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const prismaClient: PrismaClient = event.context.prisma;

    const query = getQuery(event);
    const search = typeof query.search == "string" ? query.search : undefined;

    return prismaClient.token.findMany({
        where: {
            OR: [
                {address: search},
                {name: {contains: search, mode: "insensitive"}},
                {symbol: {contains: search, mode: "insensitive"}},
            ],
        },
        take: 5,
    });
});