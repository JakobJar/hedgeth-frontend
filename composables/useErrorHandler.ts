import {type DecodedError, ErrorDecoder} from 'ethers-decode-error';
import {useToast} from "vue-toastification";

const errorDecoder = ErrorDecoder.create();

export const useErrorHandler = () => {
  const decodeEthersError = (error: any): Promise<DecodedError> => {
    return errorDecoder.decode(error);
  }

  const showEthersErrorToast = async (error: any) => {
    const decodedError = await decodeEthersError(error);
    const reason = decodedError.reason;
    if (!reason) {
      useToast().error("An unknown error occurred.");
      return;
    }
    useToast().error(reason);
  }

  return {
      decodeEthersError,
      showEthersErrorToast
  };
};