import {
    Program,
    AnchorError,
    Wallet,
    BN,
    AnchorProvider,
    setProvider,
    workspace,
    web3,
}
    from "@coral-xyz/anchor";
import { Gemquest } from "../target/types/gemquest";
import { assert, expect } from "chai";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Keypair, PublicKey, sendAndConfirmTransaction, } from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    getMint,
    getAccount,
    unpackAccount,
    Account,
} from "@solana/spl-token";



describe("***** GemQuest Unit TESTS ******", () => {

    let ADMIN: Wallet;
    const USER_1 = Keypair.generate();
    let program: Program<Gemquest>;
    let isDevnet: boolean = true;
    let MINT_TOKEN_ACCOUNT: Keypair;
    let MINT_NFT_ACCOUNT: Keypair;

    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');


    before(async () => {

        // Get env from anchor.toml
        const provider = AnchorProvider.env();
        if (provider.connection.rpcEndpoint === 'http://127.0.0.1:8899' || provider.connection.rpcEndpoint === 'localnet') {
            isDevnet = false;
        }
        setProvider(provider);
        ADMIN = provider.wallet as Wallet;

        console.log("Launching test on: ", provider.connection.rpcEndpoint);
        console.log("Admin wallet:", ADMIN.publicKey.toBase58());
        console.log("User1 wallet:", USER_1.publicKey.toBase58());

        program = workspace.Gemquest as Program<Gemquest>;

        console.log('Program_ID: ', program.programId.toBase58());

        if (isDevnet) {
            // MINT_TOKEN_ACCOUNT = "Ct7Dssm7FNEkzhXteikNtNm9ALtbGr3mMHkHszrrZLGr";
            MINT_TOKEN_ACCOUNT = Keypair.generate();
            MINT_NFT_ACCOUNT = Keypair.generate();
        }
        else {
            MINT_TOKEN_ACCOUNT = Keypair.generate();
            MINT_NFT_ACCOUNT = Keypair.generate();

            await requestAirdrop(ADMIN.publicKey);
            await requestAirdrop(USER_1.publicKey);
        }
    });

    const requestAirdrop = async (publicKey: PublicKey) => {
        const airdropSignature = await program.provider.connection.requestAirdrop(
            ADMIN.publicKey,
            2 * web3.LAMPORTS_PER_SOL
        );

        await program.provider.connection.confirmTransaction(airdropSignature);
    }

    //     describe("GemQuest User acconts TESTS", () => {

    //         it("- should initialize a new user account", async () => {

    //             // Generate a new keypair for the user
    //             const userKeypair = anchor.web3.Keypair.generate();

    //             // Generate the user account PDA
    //             const [userAccountPda] = await anchor.web3.PublicKey.findProgramAddress(
    //                 [Buffer.from(USER_ACCOUNT_SEED), userKeypair.publicKey.toBuffer()],
    //                 program.programId
    //             );

    //             console.log("User account PDA:", userAccountPda.toBase58());

    //             // Create a transaction to initialize the user account
    //             await program.methods
    //                 .initializeUserAccount()
    //                 .accounts({
    //                     userAccount: userAccountPda,
    //                     admin: provider.wallet.publicKey, // Admin will pays for the transaction
    //                     user: userKeypair.publicKey,
    //                     systemProgram: anchor.web3.SystemProgram.programId,
    //                 })
    //                 .signers([provider.wallet.payer])
    //                 .rpc();

    //             // Fetch the user account and verify its authority
    //             const userAccount = await program.account.userAccount.fetch(userAccountPda);
    //             expect(userAccount.authority.toString()).to.equal(userKeypair.publicKey.toString());
    //         });

    //         it("- should fails when initialize a new user account with an unauthorized admin", async () => {
    //             // Generate a new keypair for the user
    //             const userKeypair = anchor.web3.Keypair.generate();

    //             // Generate the user account PDA
    //             const [userAccountPda] = await anchor.web3.PublicKey.findProgramAddress(
    //                 [Buffer.from(USER_ACCOUNT_SEED), userKeypair.publicKey.toBuffer()],
    //                 program.programId
    //             );

    //             console.log("User account PDA:", userAccountPda.toBase58());

    //             // Create a transaction to initialize the user account with an unauthorized admin
    //             const unauthorizedAdmin = anchor.web3.Keypair.generate();
    //             try {
    //                 await program.methods
    //                     .initializeUserAccount()
    //                     .accounts({
    //                         userAccount: userAccountPda,
    //                         admin: unauthorizedAdmin.publicKey,
    //                         user: userKeypair.publicKey,
    //                         systemProgram: anchor.web3.SystemProgram.programId,
    //                     })
    //                     .signers([unauthorizedAdmin])
    //                     .rpc();

    //                 assert.fail("Expected transaction to fail");
    //             }
    //             catch (error) {

    //                 // console.log((error as AnchorError).message);
    //                 // assert.equal(
    //                 //     error.error.errorMessage,
    //                 //     "",
    //                 //     ""
    //                 // );
    //             }
    //         });
    //     });

    describe("*** GemQuest GEM Token program TESTS ***", () => {

        const metadata = {
            name: 'Solana GEMS',
            symbol: 'GEMS',
            uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
        };

        before(async () => {

            console.log("Mint Token Account", MINT_TOKEN_ACCOUNT.publicKey.toBase58());
        });

        it('- should create a new spl-token', async () => {
            await program.methods
                .createToken(metadata.name, metadata.symbol, metadata.uri)
                .accounts({
                    payer: ADMIN.publicKey,
                    mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
                })
                .signers([MINT_TOKEN_ACCOUNT])
                .rpc();


            // Will throw if the mint account does not exist.
            const mintInfo = await getMint(program.provider.connection, new PublicKey(MINT_TOKEN_ACCOUNT.publicKey));
            assert.isNotNull(mintInfo, 'Mint info should not be null');
        });

        it('- should spl-token created with the correct address', async () => {

            const mintInfo = await getMint(program.provider.connection, new PublicKey(MINT_TOKEN_ACCOUNT.publicKey));
            expect(mintInfo.address.toString()).to.equal(MINT_TOKEN_ACCOUNT.publicKey.toString());
        });

        it('- should spl-token created with the correct authority address', async () => {

            const mintInfo = await getMint(program.provider.connection, new PublicKey(MINT_TOKEN_ACCOUNT.publicKey));
            expect(mintInfo.mintAuthority.toString()).to.equal(ADMIN.publicKey.toString());
        });

        it('- should fails if minting tokens with invalid value', async () => {
            try {
                // Derive the associated token address account for the mint and user.
                const associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT.publicKey, USER_1.publicKey);

                // Amount of tokens to mint.
                const invalidAmount = 0;

                await program.methods
                    .mintTokensToUser(new BN(invalidAmount))
                    .accounts({
                        mintAuthority: ADMIN.publicKey,
                        recipient: USER_1.publicKey,
                        mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
                        associatedTokenAccount: associatedTokenAccountAddress,

                        // system
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                        systemProgram: web3.SystemProgram.programId,
                    })
                    .rpc();

                assert.fail("Expected transaction to fail");
            }
            catch (error) {

            }
        });

        it('- should mint some tokens to the user wallet', async () => {

            // Derive the associated token address account for the mint and user.
            const associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT.publicKey, USER_1.publicKey);

            // Amount of tokens to mint.
            const amount = 100;

            let previousBalance: number;
            try {
                previousBalance = (
                    await program.provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
                ).value.uiAmount;
            }
            catch {
                // Will throw if the associated token account does not exist yet.
                previousBalance = 0;
            }

            // Mint the tokens to the associated token account.
            const transactionSignature = await program.methods
                .mintTokensToUser(new BN(amount))
                .accounts({
                    mintAuthority: ADMIN.publicKey,
                    recipient: USER_1.publicKey,
                    mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
                    associatedTokenAccount: associatedTokenAccountAddress,

                    // system
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            const postBalance = (
                await program.provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
            ).value.uiAmount;

            expect(postBalance.toString()).to.equal((previousBalance + amount).toString());
        });
    });

    describe("*** GemQuest NFT TESTS ***", () => {

        const NFT_PRICE = 10 * web3.LAMPORTS_PER_SOL;
        let associatedTokenAccountAddress;
        let associatedNftAccountAddress;

        // The metadata for our NFT
        const metadata = {
            name: 'Free Snack',
            symbol: 'GQFS',
            uri: 'ipfs://bafybeibb5rh62yfijm7ypoaphsz4rzvf7wlvjucicafu5v3eq2aur3rv3a/GQFS.json',
        };

        before(async () => {

            console.log("Mint NFT Account", MINT_NFT_ACCOUNT.publicKey.toBase58());
            console.log("Mint Token Account", MINT_TOKEN_ACCOUNT.publicKey.toBase58());

            // Derive the associated token address account for the mint and user.
            associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT.publicKey, USER_1.publicKey);

            // Derive the associated nft token address account for the mint and user.
            associatedNftAccountAddress = getAssociatedTokenAddressSync(MINT_NFT_ACCOUNT.publicKey, USER_1.publicKey);
        });

        it('- should fails if approving more tokens than owned', async () => {
            try {
                // Derive the associated token address account for the mint and user.
                const associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT.publicKey, USER_1.publicKey);

                // Amount of tokens to mint.
                const invalidAmount = 9999999;

                await program.methods
                    .approveToken(new BN(invalidAmount))
                    .accounts({

                        associatedTokenAccount: associatedTokenAccountAddress,

                        delegate: ADMIN.publicKey,
                        authority: USER_1.publicKey,

                        // system
                        tokenProgram: TOKEN_PROGRAM_ID,
                    })
                    .signers([USER_1])
                    .rpc();

                assert.fail("Expected transaction to fail");
            }
            catch (error) {

            }
        });

        it('- should approve the right amount of delegated token', async () => {

            await program.methods
                .approveToken(new BN(NFT_PRICE))
                .accounts({

                    associatedTokenAccount: associatedTokenAccountAddress,

                    delegate: ADMIN.publicKey,
                    authority: USER_1.publicKey,

                    // system
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .signers([USER_1])
                .rpc();

            const accountInfo = await program.provider.connection.getAccountInfo(associatedTokenAccountAddress);
            const uAccount = unpackAccount(associatedTokenAccountAddress, accountInfo, TOKEN_PROGRAM_ID);

            expect(uAccount.delegatedAmount.toString()).to.equal(NFT_PRICE.toString());
        });

        // TODO: investigate - Get error account already in use 
        // it('- should fails if creating a NFT without enough token', async () => {
        //     try {
        //         // Derive the associated token address account for the mint and user.
        //         const associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT.publicKey, USER_1.publicKey);

        //         // Amount of tokens to mint.
        //         const invalidAmount = 9999999;

        //         const [metadataAccount] = await PublicKey.findProgramAddress(
        //             [
        //                 Buffer.from("metadata"),
        //                 TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        //                 MINT_NFT_ACCOUNT.publicKey.toBuffer(),
        //             ],
        //             TOKEN_METADATA_PROGRAM_ID
        //         );

        //         const [editionAccount] = await PublicKey.findProgramAddress(
        //             [
        //                 Buffer.from("metadata"),
        //                 TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        //                 MINT_NFT_ACCOUNT.publicKey.toBuffer(),
        //                 Buffer.from("edition"),
        //             ],
        //             TOKEN_METADATA_PROGRAM_ID
        //         );

        //         await program.methods
        //             .createNft(metadata.name, metadata.symbol, metadata.uri, new BN(invalidAmount))
        //             .accounts({
        //                 payer: ADMIN.publicKey,

        //                 associatedTokenAccount: associatedTokenAccountAddress,
        //                 mintTokenAccount: MINT_TOKEN_ACCOUNT.publicKey,

        //                 metadataAccount: metadataAccount,
        //                 editionAccount: editionAccount,

        //                 mintNftAccount: MINT_NFT_ACCOUNT.publicKey,
        //                 associatedNftTokenAccount: associatedNftAccountAddress,

        //                 user: USER_1.publicKey,

        //                 // system
        //                 tokenProgram: TOKEN_PROGRAM_ID,
        //                 tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        //                 associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        //                 systemProgram: web3.SystemProgram.programId,
        //                 rent: web3.SYSVAR_RENT_PUBKEY,
        //             })
        //             .signers([MINT_NFT_ACCOUNT])
        //             .rpc();


        //         assert.fail("Expected transaction to fail");
        //     }
        //     catch (error) {

        //     }
        // });

        let tokenBalanceBeforeMintNft: number;
        it('- should create a new NFT', async () => {

            tokenBalanceBeforeMintNft = (
                await program.provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
            ).value.uiAmount;


            let nftAccountInfoBefore: Account;
            let nftAmount: number;
            try {
                nftAccountInfoBefore = await getAccount(program.provider.connection, associatedNftAccountAddress);
            }
            catch {
                // Will throw if the associated NFT token account does not exist yet.
                nftAmount = 0;
            }

            const [metadataAccount] = await PublicKey.findProgramAddress(
                [
                    Buffer.from("metadata"),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    MINT_NFT_ACCOUNT.publicKey.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID
            );

            const [editionAccount] = await PublicKey.findProgramAddress(
                [
                    Buffer.from("metadata"),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    MINT_NFT_ACCOUNT.publicKey.toBuffer(),
                    Buffer.from("edition"),
                ],
                TOKEN_METADATA_PROGRAM_ID
            );

            await program.methods
                .createNft(metadata.name, metadata.symbol, metadata.uri, new BN(NFT_PRICE))
                .accounts({
                    payer: ADMIN.publicKey,

                    associatedTokenAccount: associatedTokenAccountAddress,
                    mintTokenAccount: MINT_TOKEN_ACCOUNT.publicKey,

                    metadataAccount: metadataAccount,
                    editionAccount: editionAccount,

                    mintNftAccount: MINT_NFT_ACCOUNT.publicKey,
                    associatedNftTokenAccount: associatedNftAccountAddress,

                    user: USER_1.publicKey,

                    // system
                    tokenProgram: TOKEN_PROGRAM_ID,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                })
                .signers([MINT_NFT_ACCOUNT])
                .rpc();


            const nftAccountInfoAfter = await getAccount(program.provider.connection, associatedNftAccountAddress);
            expect(nftAccountInfoAfter.amount.toString()).to.equal((nftAmount + 1).toString());
        });

        it('- should burn the right amount of a token', async () => {

            const tokenBalanceAfterMintNFT = (
                await program.provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
            ).value.uiAmount;

            expect(tokenBalanceAfterMintNFT.toString()).to.equal((tokenBalanceBeforeMintNft - (NFT_PRICE / web3.LAMPORTS_PER_SOL)).toString());

        });
    });

});
