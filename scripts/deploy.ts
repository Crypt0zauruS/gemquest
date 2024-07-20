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

  // Set Wallet that will be the admin of the program
  const walletKP = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(process.env.DEPLOYER_PRIVATE_KEY))
  );
  wallet = new anchor.Wallet(walletKP);
  console.log("Wallet:", wallet.publicKey.toBase58());

  // Set provider
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  // Load the program
  const idl = JSON.parse(
    require("fs").readFileSync("./target/idl/gemquest.json", "utf8")
  );
  program = new Program(idl, provider);
  console.log("Program ID:", program.programId.toBase58());

  // await InitializeProgramAdmin();

  // Fonction pour convertir l'URL IPFS en URL HTTP
  const convertIpfsToHttp = async (ipfsUrl: string) => {
    const httpMetadataUri = ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    const response = await fetch(httpMetadataUri);
    const fetched: any = await response.json();
    const metadata = {
      name: fetched.name,
      symbol: fetched.symbol,
      uri: ipfsUrl,
    };
    return metadata;
  };

  //const metadataNFT_FreeSnack = {
  //  name: "Free Snack V4",
  //  symbol: "GQFS",
  //  uri: "ipfs://bafybeibb5rh62yfijm7ypoaphsz4rzvf7wlvjucicafu5v3eq2aur3rv3a/GQFS.json",
  // };

  // await CreateNFT(
  // convertIpfsToHttp(
  //   "ipfs://bafybeibb5rh62yfijm7ypoaphsz4rzvf7wlvjucicafu5v3eq2aur3rv3a/GQFS.json"
  // )
  //);

  // const metadataToken_GEM = {
  //   name: "Solana GEMS",
  //   symbol: "GEMS",
  //   uri: "ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_1.json",
  // };
  await CreateToken(
    convertIpfsToHttp(
      "ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_1.json"
    )
  );
}

/**
 * Initialize the program admin
 */
async function InitializeProgramAdmin() {
  const [programAdminAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(SEED_PROGRAM_ADMIN)],
    program.programId
  );
  // await program.rpc.initializeProgram({
  //     accounts: {
  //         payer: wallet.publicKey,
  //         programAdmin: programAdminAccount,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //     },
  //     signers: [wallet.payer],
  // });

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

/**
 * Create a new NFT with metadata
 */
async function CreateNFT(metadata) {
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

  // Create a transaction to initialize the user account
  // await program.methods
  //     .initializeUserAccount()
  //     .accounts({
  //         userAccount: userAccountPda,
  //         admin: provider.wallet.publicKey, // Admin will pays for the transaction
  //         user: userKeypair.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([walletKP])
  //     .rpc();

  // // Initialize the account.
  // await program.rpc.initialize(new anchor.BN(0), {
  //     accounts: {
  //         baseAccount: baseAccount.publicKey,
  //         user: provider.wallet.publicKey,
  //         systemProgram: web3.SystemProgram.programId,
  //     },
  //     signers: [baseAccount],
  // });
  // console.log('Initialized account with data 0');

  // // Update the account with a new value.
  // await program.rpc.update(new anchor.BN(123), {
  //     accounts: {
  //         baseAccount: baseAccount.publicKey,
  //     },
  // });
  // console.log('Updated account with data 123');

  // // Get the current value stored in the account.
  // const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  // console.log('Account data:', account.data.toString());
}

/*
 * Create a new token with metadata
 */
async function CreateToken(metadata) {
  // Generate a new keypair for the mint
  const mintAccount = new Keypair();

  const [metadataAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from(SEED_METADATA),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintAccount.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  await program.methods
    .createToken(metadata.name, metadata.symbol, metadata.uri)
    .accounts({
      payer: wallet.publicKey,
      mintAccount: mintAccount.publicKey,

      metadataAccount: metadataAccount,

      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([mintAccount])
    .rpc();

  console.log("Token created with metadata:", metadata);
  console.log("Token created at:", mintAccount.publicKey.toBase58());
  console.log("Metadata Account:", metadataAccount.toBase58());
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
