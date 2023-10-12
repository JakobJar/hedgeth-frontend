import {PrismaClient} from "@prisma/client";
import {AlphaRouter, SwapType} from "@uniswap/smart-order-router";
import {ChainId, CurrencyAmount, Percent, Token, TradeType} from "@uniswap/sdk-core";
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

    const FLOKI = new Token(
        1,
        '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e',
        9,
        'FLOKI',
        'FLOKI INU'
    );

    const WETH = new Token(
        ChainId.SEPOLIA,
        '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
        18,
        'WETH',
        'Wrapped Ether'
    );

    const USDC = new Token(
        ChainId.SEPOLIA,
        '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5',
        6,
        'USDC',
        'USD//C'
    );



    const options = {
        recipient: '',
        slippageTolerance: new Percent(1, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
    }
    const typedValueParsed = '1000000000000000000'




    const route = await router.route(
        CurrencyAmount.fromRawAmount(
            WETH,
            typedValueParsed.toString()
        ),
        USDC,
        TradeType.EXACT_INPUT,
        options
    )

    return route;
});