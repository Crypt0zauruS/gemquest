import * as anchor from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

describe("NFT Minter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet;
  const program = anchor.workspace.Gemquest;

  console.log("PROGRAM_ID: ", program.programId.toBase58());
  console.log("PAYER_ADDRESS: ", payer.publicKey.toBase58());

  // URL des métadonnées de notre NFT
  const metadataUri =
    "ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_1.json";

  // Fonction pour convertir l'URL IPFS en URL HTTP
  const convertIpfsToHttp = (ipfsUrl) => {
    return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  it("Create an NFT!", async () => {
    // Convertir l'URL IPFS en URL HTTP
    const httpMetadataUri = convertIpfsToHttp(metadataUri);

    // Récupérer les métadonnées depuis l'URL IPFS
    const response = await fetch(httpMetadataUri);
    const metadata = await response.json();

    // Générer une paire de clés à utiliser comme adresse de notre compte mint
    const mintKeypair = new Keypair();

    // Dériver l'adresse du compte de token associé pour le mint et le payer
    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      payer.publicKey
    );

    const transactionSignature = await program.methods
      .createNft(metadata.name, metadata.symbol, metadataUri)
      .accounts({
        payer: payer.publicKey,
        mintAccount: mintKeypair.publicKey,
        associatedTokenAccount: associatedTokenAccountAddress,
      })
      .signers([mintKeypair])
      .rpc({ skipPreflight: true });

    console.log("Success!");
    console.log(`   Mint Address: ${mintKeypair.publicKey}`);
    console.log(
      `   Associated Account (Holder): ${associatedTokenAccountAddress}`
    );
    console.log(`Token Program: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`);
    console.log(
      `Associated Token Program: ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`
    );
    console.log(`System Program: 11111111111111111111111111111111`);
    console.log(`   Transaction Signature: ${transactionSignature}`);
  });
});
