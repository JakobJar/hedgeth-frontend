import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const address = getRouterParam(event, "address");
    if (!address)
        throw new Error("No hash");
    const body = await readBody(event);

    await prisma.fund.upsert({
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
    return "Success";
});