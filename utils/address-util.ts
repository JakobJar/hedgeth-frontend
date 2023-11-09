export const convertAddressToBuffer = (address: string | undefined): Buffer => {
    if (!address)
        return Buffer.alloc(0);
    return Buffer.from(address.replace('0x', ''), 'hex');
}

export const convertBufferToAddress = (buffer: Buffer) => {
    return `0x${buffer.toString('hex')}`;
}