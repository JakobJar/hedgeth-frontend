import {AbstractProvider, BrowserProvider, ethers, Signer} from "ethers";

export const useEthersProvider = async (): Promise<AbstractProvider> => {
    if (process.server) {
        const runtimeConfig = useRuntimeConfig();
        return new ethers.InfuraProvider(runtimeConfig.public.network, runtimeConfig.infura.projectId, runtimeConfig.infura.projectSecret);
        // @ts-ignore
    } else if (window.ethereum) {
        // @ts-ignore
        return new BrowserProvider(window.ethereum);
    } else {
        throw new Error("No window.ethereum available");
    }
}

export const useEthersSigner = async (): Promise<Signer> => {
    const provider = await useEthersProvider();
    if (!(provider instanceof BrowserProvider))
        throw new Error("Provider is not a BrowserProvider");

    return await provider.getSigner();
}