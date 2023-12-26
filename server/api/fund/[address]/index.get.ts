import {PrismaClient} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const prismaClient: PrismaClient = event.context.prisma;

    const address = getRouterParam(event, "address");
    if (!address)
        throw createError({
            status: 400,
            statusMessage: "No address provided"
        });

    return prismaClient.fund.findUnique({
        where: {
            address: address,
        }
    });
});