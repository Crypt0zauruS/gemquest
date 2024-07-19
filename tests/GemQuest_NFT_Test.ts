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

         // Generate a keypair for the token mint (used for burning tokens)
         const tokenMintKeypair = new Keypair();

         

        // Derive the associated token address account for the mint and payer.
        const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);

        // Derive the associated token address for the token mint and payer (user's token account). (used for burning tokens)
        const userTokenAccountAddress = getAssociatedTokenAddressSync(tokenMintKeypair.publicKey, payer.publicKey);

        // Assume `burn_amount` to be defined, or set a default (used for burning tokens)
        const burnAmount = 10; 

        const transactionSignature = await program.methods
            .createNft(metadata.name, metadata.symbol, metadata.uri)
            .accounts({
                payer: payer.publicKey,
                mintAccount: mintKeypair.publicKey,
                associatedTokenAccount: associatedTokenAccountAddress,
                 tokenMint: tokenMintKeypair.publicKey, // Account for the token mint
                userTokenAccount: userTokenAccountAddress, // Account from which tokens will be burned
                tokenProgram: TOKEN_PROGRAM_ID // Include the Token Program ID
            })
            .signers([mintKeypair, tokenMintKeypair]) // Include token mint keypair as a signer (Not sure)
            .rpc({ skipPreflight: true });

        console.log('Success!');
        console.log(`   Mint Address: ${mintKeypair.publicKey}`);
        console.log(`   Holder: ${associatedTokenAccountAddress}`);
        console.log(`   Transaction Signature: ${transactionSignature}`);
        console.log(`   Burned Tokens from: ${userTokenAccountAddress}`); // TO BURN
    });
});
