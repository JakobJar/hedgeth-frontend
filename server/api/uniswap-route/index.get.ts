import {PrismaClient} from "@prisma/client";
import {AlphaRouter} from "@uniswap/smart-order-router";
import {ChainId} from "@uniswap/sdk-core";
import {JsonRpcProvider} from "ethers";
import {useEthersProvider} from "~/composables/useEthers";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
    const provider = await useEthersProvider();

    if (!(provider instanceof JsonRpcProvider))
        return;
    // @ts-ignore TODO: Remove hacky solution
    provider._isProvider = true;

    const router = new AlphaRouter({
        chainId: ChainId.SEPOLIA,
        // @ts-ignore Marks error because of missing types due to changes in ethers 6
        provider: provider,
    });

    return "Hallo";
});