import {useEthersProvider} from "~/composables/useEthers";
import {Contract, ethers} from "ethers";
import {PrismaClient} from "@prisma/client";
import * as fs from "fs";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
    const ethersProvider = await useEthersProvider();

    const address = getRouterParam(event, "address");
    if (!address)
        throw createError({
            status: 400,
            statusMessage: "No address provided"
        });

    const body = await readBody(event);
    if (!body?.name || !body?.signedMessage)
        throw createError({
            status: 400,
            statusMessage: "No name or signedMessage provided"
        });

    const fundABI: string = JSON.parse(fs.readFileSync("public/abi/fund.json", "utf8"));
    const contract = new Contract(address, fundABI, ethersProvider);

    const signer = ethers.verifyMessage(address, body.signedMessage);
    const owner: string = await contract.owner();

    if (signer !== owner)
        throw createError({
            statusCode: 401,
            message: "Invalid signature"
        });

    return prismaClient.fund.upsert({
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
            raisingClose: new Date(Number(await contract.fundRaisingClose()) * 1000),
            close: new Date(Number(await contract.fundClose()) * 1000)
        }
    });
});