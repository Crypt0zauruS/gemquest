// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Gemquest } from "./target/types/gemquest";
// import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
// import { assert, should } from "chai";

// describe("***** GemQuest TESTS ******", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);
//   const admin = provider.wallet;

//   // const program = anchor.workspace.Gemquest as Program<Gemquest>;
//   let program: Program<Gemquest>;


//   let tokenGemAccount = anchor.web3.Keypair.generate();
//   let adminTokenGemsAccount;

//   let userAccount = anchor.web3.Keypair.generate();
//   let userAccount2 = anchor.web3.Keypair.generate();
//   let userAccount3 = anchor.web3.Keypair.generate();

//   const initializeUserAccount = async (userAccount: anchor.web3.Keypair) => {
//     await program.methods.initialize()
//       .accounts({
//         admin: admin.publicKey,
//         userAccount: userAccount.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([userAccount])
//       .rpc();
//   };

//   // beforeEach(async () => {

//   program = anchor.workspace.Gemquest as Program<Gemquest>;;

//   // Be sure that program ID is the same in lib.rs
//   console.log("Using program ID:", program.programId.toBase58());
//   // });

//   /**
//    * INITIALIZATION
//    */
//   describe("** Initialization **", () => {

//     /**
//     * USER ACCOUNT
//     */
//     describe("* User account *", () => {

//       it('- it should initialize one user account', async () => {

//         await initializeUserAccount(userAccount);

//         const userAccounts = await program.account.userAccount.all();
//         assert.strictEqual(userAccounts.length, 1);
//       });

//       it('- it should initialize 2 user accounts', async () => {

//         // await initializeUserAccount(userAccount);
//         await initializeUserAccount(userAccount2);

//         const userAccounts = await program.account.userAccount.all();
//         assert.strictEqual(userAccounts.length, 2);
//       });

//       it('- it should initialize user accounts with no gems', async () => {

//         const account = await program.account.userAccount.fetch(userAccount.publicKey);
//         assert.strictEqual(account.gemBalance.toString(), "0");
//       });
//     });
//   });


//   /**
//  * TOKEN GEMS
//  */
//   describe("** Token GEMS **", () => {

//     /**
//     * USER ACCOUNT
//     */
//     describe("* User account *", () => {

//       it("- it should initialize the gem mint and mint initial supply to admin", async () => {

//         // Create an associated token account for the admin
//         adminTokenGemsAccount = await anchor.utils.token.associatedAddress({
//           mint: tokenGemAccount.publicKey,
//           owner: admin.publicKey,
//         });

//         // Initial supply of tokens
//         const initialSupply = new anchor.BN(1000000000); // 1,000,000,000,000
//         const decimals = 9;

//         // Send the transaction to create the mint and mint initial supply
//         await program.methods
//           .initializeMintTokenGems(decimals, initialSupply)
//           .accounts({
//             tokenGemAccount: tokenGemAccount.publicKey,
//             adminTokenGemsAccount: adminTokenGemsAccount,
//             admin: admin.publicKey,
//             rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//             tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
//             systemProgram: anchor.web3.SystemProgram.programId,
//           })
//           .signers([tokenGemAccount])
//           .rpc();

//         // Fetch the mint account
//         const mintAccount = await program.account.mint.fetch(tokenGemAccount.publicKey);

//         // Check if the mint account was initialized correctly
//         assert.strictEqual(mintAccount.decimals, decimals);
//         assert.strictEqual(mintAccount.mintAuthority.toBase58(), admin.publicKey.toBase58());

//         // Fetch the admin's token account
//         const adminTokenAccountInfo = await program.account.tokenAccount.fetch(adminTokenGemsAccount);

//         // Check if the initial supply was minted correctly
//         assert.strictEqual(adminTokenAccountInfo.amount.toString(), initialSupply.toString());
//       });
//     });
//   });
// });
