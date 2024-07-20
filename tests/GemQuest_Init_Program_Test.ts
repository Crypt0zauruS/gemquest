import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError } from "@coral-xyz/anchor";
import { Gemquest } from "../target/types/gemquest";
import { assert, expect } from "chai";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Keypair, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';

/**
* USER ACCOUNT
*/
describe("***** GemQuest Initialize program TESTS ******", () => {

    const SEED_PROGRAM_ADMIN = "program_admin";
    const PAYER = Keypair.generate();
    const USER_1 = Keypair.generate();

    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Gemquest as Program<Gemquest>;
    console.log("PROGRAM_ID: ", program.programId.toBase58());


    before(async () => {

        const payerAirdrop = await provider.connection.requestAirdrop(
            PAYER.publicKey,
            2 * anchor.web3.LAMPORTS_PER_SOL
        );
        await provider.connection.confirmTransaction(payerAirdrop);

        const user1Airdrop = await provider.connection.requestAirdrop(
            USER_1.publicKey,
            2 * anchor.web3.LAMPORTS_PER_SOL
        );
        await provider.connection.confirmTransaction(user1Airdrop);

    });


    /**
     * INITIALIZATION
     */
    describe("** Initialization **", () => {

        it("- should initialize the program admin", async () => {

            const [programAdminAccount] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(SEED_PROGRAM_ADMIN)],
                program.programId
            );

            await program.methods
                .initializeProgram()
                .accounts({
                    payer: PAYER.publicKey,
                    programAdmin: programAdminAccount,
                    systemProgram: anchor.web3.SystemProgram.programId,
                } as {
                    payer: anchor.web3.PublicKey;
                    programAdmin: anchor.web3.PublicKey;
                    systemProgram: anchor.web3.PublicKey;
                })
                .signers([PAYER])
                .rpc();

            const account = await program.account.programAdmin.fetch(programAdminAccount);
            expect(account.admin.toString()).to.equal(PAYER.publicKey.toString());
            expect(account.isInitialized).to.equal(true);
        });

        it("- should revert if trying to initalize program a second time", async () => {

            const [programAdminAccount] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(SEED_PROGRAM_ADMIN)],
                program.programId
            );

            try {

                await program.methods
                    .initializeProgram()
                    .accounts({
                        payer: USER_1.publicKey,
                        programAdmin: programAdminAccount,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    } as {
                        payer: anchor.web3.PublicKey;
                        programAdmin: anchor.web3.PublicKey;
                        systemProgram: anchor.web3.PublicKey;
                    })
                    .signers([USER_1])
                    .rpc();
                assert.fail("Expected transaction to fail");
            }
            catch (error) {

                const account = await program.account.programAdmin.fetch(programAdminAccount);
                expect(account.admin.toString()).to.equal(PAYER.publicKey.toString());
                expect(account.isInitialized).to.equal(true);
            }

        });
    });
});