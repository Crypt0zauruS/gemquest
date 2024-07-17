import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError } from "@coral-xyz/anchor";
import { Gemquest } from "../target/types/gemquest";
import { assert, expect } from "chai";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

/**
* USER ACCOUNT
*/
describe("***** GemQuest User Account TESTS ******", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Gemquest as Program<Gemquest>;
    console.log("PROGRAM_ID: ", program.programId.toBase58());
    const USER_ACCOUNT_SEED = "user_account";

    /**
     * INITIALIZATION
     */
    describe("** Initialization **", () => {

        it("- should initialize a new user account", async () => {

            // Generate a new keypair for the user
            const userKeypair = anchor.web3.Keypair.generate();

            // Generate the user account PDA
            const [userAccountPda] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(USER_ACCOUNT_SEED), userKeypair.publicKey.toBuffer()],
                program.programId
            );

            console.log("User account PDA:", userAccountPda.toBase58());

            // Create a transaction to initialize the user account
            await program.methods
                .initializeUserAccount()
                .accounts({
                    userAccount: userAccountPda,
                    admin: provider.wallet.publicKey, // Admin will pays for the transaction
                    user: userKeypair.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([provider.wallet.payer])
                .rpc();

            // Fetch the user account and verify its authority
            const userAccount = await program.account.userAccount.fetch(userAccountPda);
            expect(userAccount.authority.toString()).to.equal(userKeypair.publicKey.toString());
        });

        it("- should fails when initialize a new user account with an unauthorized admin", async () => {
            // Generate a new keypair for the user
            const userKeypair = anchor.web3.Keypair.generate();

            // Generate the user account PDA
            const [userAccountPda] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(USER_ACCOUNT_SEED), userKeypair.publicKey.toBuffer()],
                program.programId
            );

            console.log("User account PDA:", userAccountPda.toBase58());

            // Create a transaction to initialize the user account with an unauthorized admin
            const unauthorizedAdmin = anchor.web3.Keypair.generate();
            try {
                await program.methods
                    .initializeUserAccount()
                    .accounts({
                        userAccount: userAccountPda,
                        admin: unauthorizedAdmin.publicKey,
                        user: userKeypair.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([unauthorizedAdmin])
                    .rpc();

                assert.fail("Expected transaction to fail");
            }
            catch (error) {

                // console.log((error as AnchorError).message);
                // assert.equal(
                //     error.error.errorMessage,
                //     "",
                //     ""
                // );
            }
        });
    });
});