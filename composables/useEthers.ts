import {AbstractProvider, BrowserProvider, ethers} from "ethers";

export const useEthersProvider = async (): Promise<AbstractProvider> => {
    // @ts-ignore
    if (!window.ethereum) {
        const runtimeConfig = useRuntimeConfig();
        return ethers.getDefaultProvider(runtimeConfig.public.network, {
            infura: {
                projectId: runtimeConfig.infura.projectId,
                projectSecret: runtimeConfig.infura.projectSecret,
            },
        });
    } else {
        // @ts-ignore
        return new ethers.BrowserProvider(window.ethereum);
    }
}

export const useEthersSigner = async (force = false): Promise<ethers.Signer> => {
    const provider = await useEthersProvider();
    if (!(provider instanceof BrowserProvider))
        throw new Error("Provider is not a BrowserProvider");
    if (!force && (await provider.listAccounts()).length === 0)
        throw new Error("No accounts available");

    return await provider.getSigner();
}