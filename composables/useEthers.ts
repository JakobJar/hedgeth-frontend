import {AbstractProvider, BrowserProvider, ethers, JsonRpcSigner} from "ethers";
import {useToast} from "vue-toastification";

export const useEthersProvider = async (): Promise<AbstractProvider> => {
    if (process.server) {
        const runtimeConfig = useRuntimeConfig();
        return new ethers.InfuraProvider(runtimeConfig.public.network, runtimeConfig.infuraProjectId, runtimeConfig.infuraProjectSecret);
        // @ts-ignore
    } else if (window.ethereum) {
        // @ts-ignore
        return new BrowserProvider(window.ethereum);
    } else {
        throw new Error("No window.ethereum available");
    }
}

export const useEthersSigner = async (): Promise<JsonRpcSigner> => {
    let provider;
    try {
        provider = await useEthersProvider();
    } catch (e) {
        const toast = useToast();
        toast.error("No wallet available.");
        throw e;
    }
    if (!(provider instanceof BrowserProvider))
        throw new Error("Provider is not a BrowserProvider");

    try {
        return await provider.getSigner();
    } catch (e) {
        const toast = useToast();
        toast.error("Please connect your wallet.");
        throw e;
    }
}

export const useCurrentAddress = async (): Promise<string | undefined> => {
    // @ts-ignore
    const provider = window.ethereum;
    if (!provider)
        return undefined;

    const accounts: string[] = await provider.request({method: 'eth_accounts'});
    return accounts[0];
}