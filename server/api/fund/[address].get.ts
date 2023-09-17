import {PrismaClient} from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
    const address = getRouterParam(event, "address");
    if (!address)
        throw new Error("No address provided");

    return prismaClient.fund.findUnique({
        where: {
            address,
        }
    });
});