// import * as anchor from '@coral-xyz/anchor';
// import { getAssociatedTokenAddressSync } from '@solana/spl-token';
// import { Keypair, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
// import { Gemquest } from "../target/types/gemquest";
// ;

// describe('***** GemQuest GEMS Token TESTS ******', () => {
//     const provider = anchor.AnchorProvider.env();
//     anchor.setProvider(provider);
//     const admin = provider.wallet as anchor.Wallet;
//     const program = anchor.workspace.Gemquest as anchor.Program<Gemquest>;

//     console.log('PROGRAM_ID: ', program.programId.toBase58());
//     console.log('ADMIN_ADDRESS: ', admin.publicKey.toBase58());

//     const USER_1 = Keypair.generate();

//     const MINT_TOKEN_ACCOUNT = Keypair.generate();
//     const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
//     const METADATA_SEED = "metadata";

//     const metadata = {
//         name: 'Solana Gold',
//         symbol: 'GOLDSOL',
//         uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
//     };

//     // Generate new keypair to use as address for mint account.
//     // const mintPubkey = new PublicKey("Ct7Dssm7FNEkzhXteikNtNm9ALtbGr3mMHkHszrrZLGr");

//     before(async () => {

//         // Request airdrop for the user.
//         const airdropSignature = await provider.connection.requestAirdrop(
//             USER_1.publicKey,
//             2 * anchor.web3.LAMPORTS_PER_SOL
//         );
//         await provider.connection.confirmTransaction(airdropSignature);
//     });


//     /**
//      * DEPLOYMENT
//      */
//     describe('** Token deployment **', () => {

//         // it('- should create new token', async () => {

//         //     const airdropSignature = await provider.connection.requestAirdrop(
//         //         USER_1.publicKey,
//         //         2 * anchor.web3.LAMPORTS_PER_SOL
//         //     );
//         //     await provider.connection.confirmTransaction(airdropSignature);
//         //     await new Promise(resolve => setTimeout(resolve, 5000));

//         //     const transactionSignature = await program.methods
//         //         .createToken(metadata.name, metadata.symbol, metadata.uri)
//         //         .accounts({
//         //             payer: USER_1.publicKey,
//         //             mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
//         //         })
//         //         .signers([MINT_TOKEN_ACCOUNT])
//         //         .rpc();

//         //     console.log('Success!');
//         //     console.log(`   Mint Address: ${MINT_TOKEN_ACCOUNT.publicKey}`);
//         //     console.log(`   Transaction Signature: ${transactionSignature}`);
//         // });   

//         it('- should create new token', async () => {

//             const [metadataAddress] = await PublicKey.findProgramAddress(
//                 [
//                     Buffer.from(METADATA_SEED),
//                     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//                     MINT_TOKEN_ACCOUNT.publicKey.toBuffer(),
//                 ],
//                 TOKEN_METADATA_PROGRAM_ID
//             );


//             const tx = await program.methods
//                 .createToken(metadata.name, metadata.symbol, metadata.uri)
//                 .accounts({
//                     payer: USER_1.publicKey,
//                     mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
//                 })
//                 .transaction();

//             const { blockhash } = await provider.connection.getLatestBlockhash();
//             tx.recentBlockhash = blockhash;
//             tx.feePayer = USER_1.publicKey;
//             await tx.sign(USER_1, MINT_TOKEN_ACCOUNT);

//             // Send and confirm the transaction
//             await sendAndConfirmTransaction(provider.connection, tx, [USER_1, MINT_TOKEN_ACCOUNT]);

//             const mintInfo = await provider.connection.getAccountInfo(MINT_TOKEN_ACCOUNT.publicKey);
//             //   assert(mintInfo !== null, "Mint account should exist");

//             // console.log(mintInfo);

//             // const metadataInfo = await provider.connection.getAccountInfo(metadataAddress);
//             // console.log(metadataInfo);

//             console.log('Success!');
//             console.log(`   Mint Address: ${MINT_TOKEN_ACCOUNT.publicKey}`);
//             // console.log(`   Transaction Signature: ${transactionSignature}`);
//         });
//     });

//     // it('Mint some tokens to your wallet!', async () => {

//     //     // Derive the associated token address account for the mint and payer.
//     //     // const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, user1.publicKey);
//     //     const associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT.publicKey, USER_1.publicKey);
//     //     // const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintPubkey, user1.publicKey);

//     //     // Amount of tokens to mint.
//     //     const amount = new anchor.BN(100);

//     //     // Mint the tokens to the associated token account.
//     //     const transactionSignature = await program.methods
//     //         .mintTokensToUser(amount)
//     //         .accounts({
//     //             mintAuthority: admin.publicKey,
//     //             recipient: USER_1.publicKey,
//     //             mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
//     //             // mintAccount: mintPubkey,
//     //             associatedTokenAccount: associatedTokenAccountAddress,
//     //         })
//     //         .rpc();

//     //     const postBalance = (
//     //         await provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
//     //     ).value.uiAmount;

//     //     console.log("new balance: ", postBalance);

//     //     console.log('Success!');
//     //     console.log(`   Associated Token Account Address: ${associatedTokenAccountAddress}`);
//     //     console.log(`   Transaction Signature: ${transactionSignature}`);
//     // });
// });
