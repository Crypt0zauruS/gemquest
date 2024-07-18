import * as anchor from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Keypair } from '@solana/web3.js';
import { Gemquest } from "../target/types/gemquest";

describe('NFT Minter', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const payer = provider.wallet as anchor.Wallet;
    const program = anchor.workspace.Gemquest as anchor.Program<Gemquest>;

    console.log('PROGRAM_ID: ', program.programId.toBase58());
    console.log('PAYER_ADDRESS: ', payer.publicKey.toBase58());


    // The metadata for our NFT
    const metadata = {
        name: 'Free Snack',
        symbol: 'GQFS',
        uri: 'ipfs://bafybeibb5rh62yfijm7ypoaphsz4rzvf7wlvjucicafu5v3eq2aur3rv3a/GQFS.json',
    };

    it('Create an NFT!', async () => {
        // Generate a keypair to use as the address of our mint account
        const mintKeypair = new Keypair();

        // Derive the associated token address account for the mint and payer.
        const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);

        const transactionSignature = await program.methods
            .createNft(metadata.name, metadata.symbol, metadata.uri)
            .accounts({
                payer: payer.publicKey,
                mintAccount: mintKeypair.publicKey,
                associatedTokenAccount: associatedTokenAccountAddress,
            })
            .signers([mintKeypair])
            .rpc({ skipPreflight: true });

        console.log('Success!');
        console.log(`   Mint Address: ${mintKeypair.publicKey}`);
        console.log(`   Holder: ${associatedTokenAccountAddress}`);
        console.log(`   Transaction Signature: ${transactionSignature}`);
    });
});
