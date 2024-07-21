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

  async function convertIpfsToHttp(ipfsUrl: string) {
    const httpMetadataUri = ipfsUrl.replace(
      "ipfs://",
      "https://fuchsia-varying-camel-696.mypinata.cloud/ipfs/"
    );
    const response = await fetch(httpMetadataUri);
    const fetched = (await response.json()) as {
      symbol: any;
      name: string;
    };
    return {
      name: fetched.name,
      symbol: fetched.symbol,
      uri: ipfsUrl,
    };
  }

  const metadata = await convertIpfsToHttp(
    "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGS.json"
  );
  await CreateNFT(metadata);
}

/**
 * Create a new NFT with metadata
 */
async function CreateNFT(metadata: any) {
  // Generate a new keypair for the mint
  const mintAccount = new Keypair();

  // Derive the associated token address account for the mint and payer.
  const associatedNftTokenAccountAddress = getAssociatedTokenAddressSync(
    mintAccount.publicKey,
    wallet.publicKey
  );

  const [metadataAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from(SEED_METADATA),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintAccount.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const [editionAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from(SEED_METADATA),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintAccount.publicKey.toBuffer(),
      Buffer.from(SEED_EDITION),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  await program.methods
    .createNft(metadata.name, metadata.symbol, metadata.uri)
    .accounts({
      payer: wallet.publicKey,
      associatedTokenAccount: associatedNftTokenAccountAddress,
      mintAccount: mintAccount.publicKey,

      metadataAccount: metadataAccount,
      editionAccount: editionAccount,

      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([mintAccount])
    .rpc();

  console.log("NFTs created with metadata:", metadata);
  console.log("NFT created at:", mintAccount.publicKey.toBase58());
  console.log(
    "Associated Token Account:",
    associatedNftTokenAccountAddress.toBase58()
  );
  console.log("Metadata Account:", metadataAccount.toBase58());
  console.log("Edition Account:", editionAccount.toBase58());
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
