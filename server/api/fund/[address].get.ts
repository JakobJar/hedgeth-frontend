import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const address = getRouterParam(event, "address");
    if (!address)
        throw new Error("No address provided");

    return prisma.fund.findUnique({
        where: {
            address,
        }
    });
});