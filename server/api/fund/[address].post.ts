import {useEthersProvider} from "~/composables/useEthers";
import {Contract, ethers} from "ethers";
import {PrismaClient} from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
    const ethersProvider = await useEthersProvider();

    const address = getRouterParam(event, "address");
    if (!address)
        throw new Error("No address provided");

    const body = await readBody(event);
    if (!body?.name || !body?.signedMessage)
        throw new Error("Invalid data");

    const fundABI: any = await $fetch("/abi/Fund.json");
    const contract = new Contract(address, fundABI, ethersProvider);

    const signer = ethers.verifyMessage(address, body.signedMessage);
    const owner: string = await contract.owner();

    if (signer !== owner)
        throw new Error("Invalid signer");

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
        }
    });
});