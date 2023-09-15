import {PrismaClient} from "@prisma/client";
import {getServerEthersProvider} from "~/server/ethers/server-ethers-provider";
import {ethers} from "ethers";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const address = getRouterParam(event, "address");
    if (!address)
        throw new Error("No address provided");

    const body = await readBody(event);
    if (!body || !body.name)
        throw new Error("No name provided");

    // TODO: verify identity of sender

    return prisma.fund.upsert({
        where: {
            address,
        },
        update: {
            name: body.name,
            description: body.description,
        },
        create: {
            address: address,
            name: body.name,
            description: body.description,
        }
    });
});