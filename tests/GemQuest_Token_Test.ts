// import * as anchor from '@coral-xyz/anchor';
// import { getAssociatedTokenAddressSync } from '@solana/spl-token';
// import { Keypair, PublicKey } from '@solana/web3.js';
// import { Gemquest } from "../target/types/gemquest";
// ;

// describe('SPL Token Minter', () => {
//     const provider = anchor.AnchorProvider.env();
//     anchor.setProvider(provider);
//     const payer = provider.wallet as anchor.Wallet;
//     const program = anchor.workspace.Gemquest as anchor.Program<Gemquest>;

//     console.log('PROGRAM_ID: ', program.programId.toBase58());
//     console.log('PAYER_ADDRESS: ', payer.publicKey.toBase58());

//     const user1 = Keypair.generate();

//     const metadata = {
//         name: 'Solana Gold',
//         symbol: 'GOLDSOL',
//         uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
//     };

//     // Generate new keypair to use as address for mint account.
//     const mintKeypair = new Keypair();
//     // const mintPubkey = new PublicKey("Ct7Dssm7FNEkzhXteikNtNm9ALtbGr3mMHkHszrrZLGr");

//     it('Create an SPL Token!', async () => {
//         const transactionSignature = await program.methods
//             .createToken(metadata.name, metadata.symbol, metadata.uri)
//             .accounts({
//                 payer: payer.publicKey,
//                 mintAccount: mintKeypair.publicKey,
//             })
//             .signers([mintKeypair])
//             .rpc();

//         console.log('Success!');
//         console.log(`   Mint Address: ${mintKeypair.publicKey}`);
//         console.log(`   Transaction Signature: ${transactionSignature}`);
//     });

//     it('Mint some tokens to your wallet!', async () => {

//         // Derive the associated token address account for the mint and payer.
//         // const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, user1.publicKey);
//         const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, user1.publicKey);
//         // const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintPubkey, user1.publicKey);

//         // Amount of tokens to mint.
//         const amount = new anchor.BN(100);

//         // Mint the tokens to the associated token account.
//         const transactionSignature = await program.methods
//             .mintTokensToUser(amount)
//             .accounts({
//                 mintAuthority: payer.publicKey,
//                 recipient: user1.publicKey,
//                 mintAccount: mintKeypair.publicKey,
//                 // mintAccount: mintPubkey,
//                 associatedTokenAccount: associatedTokenAccountAddress,
//             })
//             .rpc();

//         const postBalance = (
//             await provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
//         ).value.uiAmount;

//         console.log("new balance: ", postBalance);

//         console.log('Success!');
//         console.log(`   Associated Token Account Address: ${associatedTokenAccountAddress}`);
//         console.log(`   Transaction Signature: ${transactionSignature}`);
//     });
// });
