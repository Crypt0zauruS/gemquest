import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { clusterApiUrl, PublicKey, Connection, Keypair } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import bs58 from "bs58";
import "dotenv/config";

const SEED_PROGRAM_ADMIN = "program_admin";
const SEED_METADATA = "metadata";
const SEED_EDITION = "edition";
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

let wallet: anchor.Wallet;
let program: Program;

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const walletKPSecretKey = bs58.decode(process.env.PRIVATE_KEY);
  const walletKP = Keypair.fromSecretKey(walletKPSecretKey);

  // create a new wallet
  wallet = new anchor.Wallet(walletKP as any);
  console.log("Wallet:", wallet.publicKey.toBase58());

  // Set provider
  const provider = new anchor.AnchorProvider(connection as any, wallet, {
    preflightCommitment: "processed",
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  // Load the program
  const idl = JSON.parse(
    require("fs").readFileSync("./target/idl/gemquest.json", "utf8")
  );
  program = new Program(idl, provider);
  console.log("Program ID:", program.programId.toBase58());

  await InitializeProgramAdmin();
}

/**
 * Initialize the program admin
 */
async function InitializeProgramAdmin() {
  const [programAdminAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(SEED_PROGRAM_ADMIN)],
    program.programId
  );

  await program.methods
    .initializeProgram()
    .accounts({
      payer: wallet.publicKey,
      programAdmin: programAdminAccount,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc();
}



main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
