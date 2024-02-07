import {useEthersProvider} from "~/composables/useEthers";
import {Contract, ethers} from "ethers";
import * as fs from "fs";
import {PrismaClient} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const ethersProvider = await useEthersProvider();
    const prismaClient: PrismaClient = event.context.prisma;

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

    const fundABI: string = JSON.parse(fs.readFileSync("public/abi/ifund.json", "utf8"));
    const contract = new Contract(address, fundABI, ethersProvider);

    const signer = ethers.verifyMessage(address, body.signedMessage);
    const manager: string = await contract.manager();

    if (signer !== manager)
        throw createError({
            statusCode: 401,
            message: "Invalid signature"
        });

    const fund = await prismaClient.fund.findUnique({where: {address: address}, select: {address: true}});
    if (fund) {
        return prismaClient.fund.update({
            where: {
                address,
            },
            data: {
                name: body.name,
                description: body.description,
            }
        });
    } else {
        return prismaClient.fund.create({
            data: {
                address: address,
                name: body.name,
                manager: manager.toLowerCase(),
                description: body.description,
                raisingClose: new Date(Number(await contract.fundRaisingClose()) * 1000),
                close: new Date(Number(await contract.fundClose()) * 1000),
                performanceFee: Number(await contract.performanceFee()),
                managementFee: Number(await contract.investmentFee())
            }
        });
    }
});