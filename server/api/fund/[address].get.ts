import {PrismaClient} from "@prisma/client";
import {convertAddressToBuffer} from "~/utils/address-util";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
    const addressBuffer = convertAddressToBuffer(getRouterParam(event, "address"));
    if (!addressBuffer.length)
        throw createError({
            status: 400,
            statusMessage: "No address provided"
        });

    return prismaClient.fund.findUnique({
        where: {
            address: addressBuffer,
        }
    });
});