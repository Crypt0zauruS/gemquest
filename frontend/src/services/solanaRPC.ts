import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  Keypair,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';
// import Wallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import { CustomChainConfig, IProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
import idl from "../lib/idl.json";
import { AnchorProvider } from "@coral-xyz/anchor";
import { Program, BN, Wallet } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import bs58 from "bs58";


export default class SolanaRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  getAccounts = async (): Promise<string[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const acc = await solanaWallet.requestAccounts();
      return acc;
    } catch (error) {
      return error as string[];
    }
  };

  getBalance = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const accounts = await solanaWallet.requestAccounts();
      const balance = await conn.getBalance(new PublicKey(accounts[0]));
      return balance.toString();
    } catch (error) {
      return error as string;
    }
  };

  signMessage = async (message: string): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const msg = Buffer.from(message, "utf8");
      const res = await solanaWallet.signMessage(msg);
      return res.toString();
    } catch (error) {
      console.error("Sign message error:", error);
      return "";
    }
  };

  sendTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);

      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({
        method: "solana_provider_config",
        params: [],
      });
      const connection = new Connection(connectionConfig.rpcTarget);

      const block = await connection.getLatestBlockhash("finalized");

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(accounts[0]),
        toPubkey: new PublicKey(accounts[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transaction = new Transaction({
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
        feePayer: new PublicKey(accounts[0]),
      }).add(TransactionInstruction);

      const { signature } = await solanaWallet.signAndSendTransaction(
        transaction
      );

      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(pubKey[0]),
      }).add(TransactionInstruction);
      const signedTx = await solanaWallet.signTransaction(transaction);
      return signedTx.signature?.toString() || "";
    } catch (error) {
      return error as string;
    }
  };

  sendVersionTransaction = async (): Promise<string> => {
    try {
      const solanaWallet: SolanaWallet = new SolanaWallet(
        this.provider as IProvider
      );
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getLatestBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transactionMessage = new TransactionMessage({
        recentBlockhash: blockhash,
        instructions: [TransactionInstruction],
        payerKey: new PublicKey(pubKey[0]),
      });
      const transaction = new VersionedTransaction(
        transactionMessage.compileToV0Message()
      );
      const { signature } = await solanaWallet.signAndSendTransaction(
        transaction
      );
      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signVersionedTransaction = async (): Promise<VersionedTransaction> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transactionMessage = new TransactionMessage({
        recentBlockhash: blockhash,
        instructions: [TransactionInstruction],
        payerKey: new PublicKey(pubKey[0]),
      });
      const transaction = new VersionedTransaction(
        transactionMessage.compileToV0Message()
      );

      const signedTx = await solanaWallet.signTransaction<VersionedTransaction>(
        transaction
      );
      return signedTx;
    } catch (error) {
      throw error;
    }
  };
  signAllTransaction = async (): Promise<Transaction[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const TransactionInstruction1 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.02 * LAMPORTS_PER_SOL,
      });
      const TransactionInstruction2 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.03 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(pubKey[0]),
      }).add(TransactionInstruction);
      const transaction1 = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(pubKey[0]),
      }).add(TransactionInstruction1);
      const transaction2 = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(pubKey[0]),
      }).add(TransactionInstruction2);

      const signedTx = await solanaWallet.signAllTransactions([
        transaction,
        transaction1,
        transaction2,
      ]);
      return signedTx;
    } catch (error) {
      throw error;
      // return error as string;
    }
  };

  signAllVersionedTransaction = async (): Promise<VersionedTransaction[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");

      const transactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transactionInstruction1 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.02 * LAMPORTS_PER_SOL,
      });
      const transactionInstruction2 = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.03 * LAMPORTS_PER_SOL,
      });
      const transactionMessage = new TransactionMessage({
        recentBlockhash: blockhash,
        payerKey: new PublicKey(pubKey[0]),
        instructions: [transactionInstruction],
      });
      const transactionMessage1 = new TransactionMessage({
        recentBlockhash: blockhash,
        payerKey: new PublicKey(pubKey[0]),
        instructions: [transactionInstruction1],
      });
      const transactionMessage2 = new TransactionMessage({
        recentBlockhash: blockhash,
        payerKey: new PublicKey(pubKey[0]),
        instructions: [transactionInstruction2],
      });
      const transaction = new VersionedTransaction(
        transactionMessage.compileToV0Message()
      );
      const transaction1 = new VersionedTransaction(
        transactionMessage1.compileToV0Message()
      );
      const transaction2 = new VersionedTransaction(
        transactionMessage2.compileToV0Message()
      );
      const signedTx = await solanaWallet.signAllTransactions([
        transaction,
        transaction1,
        transaction2,
      ]);
      console.log(signedTx);
      return signedTx;
    } catch (error) {
      throw error;
      // return error as string;
    }
  };

  mintGems = async (amount: number): Promise<string> => {
    console.log(idl);
    try {

      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<
        string[],
        CustomChainConfig
      >({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);
      // const programId = new PublicKey(
      //   "EFuE6pLv3CT2PzJLRqpnnz5waiEhwssgLiTVjS4258ox"
      // );
      const programId = new PublicKey(
        "9w1KrVJaq6G9ogtLCsiPjKSAC5Ag3DZsbSXkXgdYmsN3"
      );
      const accounts = await solanaWallet.requestAccounts();
      // const wallet = {
      //   signTransaction: async (tx: Transaction) => {
      //     const signedTx = await solanaWallet.signTransaction(tx);
      //     return signedTx;
      //   },
      //   publicKey: new PublicKey(accounts[0]),
      // };




      const ENV_DEPLOYER_PRIVATE_KEY = "";
      const walletKP = Keypair.fromSecretKey(new Uint8Array(bs58.decode(ENV_DEPLOYER_PRIVATE_KEY)));

      console.log("signer:", walletKP.publicKey.toBase58());
      console.log("user:", accounts[0]);

      const wallet = {
        signTransaction: async (tx: Transaction) => {
          const signedTx = await solanaWallet.signTransaction(tx);
          return signedTx;
        },
        publicKey: walletKP,
      };
      // const provider = new anchor.AnchorProvider(conn, wallet, {
      //   commitment: "confirmed",
      // });
      // anchor.setProvider(provider);

      const wa = new Wallet(walletKP);
      // const wallett = new anchor.Wallet(walletKP);
      // const programm = new anchor.Program(idl as any, this.provider);

      const provider = new AnchorProvider(conn, wallet as any, {
        preflightCommitment: "finalized",
      });
      // const program = new anchor.Program(idl as any, programId, provider);
      const program = new Program(idl as any, programId, provider);
      console.log(program.programId.toBase58());;

      const mint = new PublicKey(
        "BuLVCNeFRVfPvqj5ov9Vo4CNyWeRDwJa7Lj65bFQd117"
      );
      // const associatedTokenAccount = new PublicKey(
      //   "HKViLJQHkuYpXM5P6QoCULx6cTiqMLXJa1Y9Zkmwf2iB"
      // );

      const associatedTokenAccount = getAssociatedTokenAddressSync(mint, new PublicKey(accounts[0]));
      console.log(associatedTokenAccount.toBase58());

      // // Décodez la clé privée de mintAuthority
      // const mintAuthoritySecretKey = bs58.decode(
      //   process.env.NEXT_PUBLIC_MINT_AUTHORITY_PRIVATE_KEY ?? ""
      // );
      // const mintAuthority = Keypair.fromSecretKey(mintAuthoritySecretKey);

      // // Vérifiez si l'account token associé existe
      // let associatedTokenAccountInfo;
      // try {
      //   associatedTokenAccountInfo = await getAccount(
      //     conn,
      //     associatedTokenAccount
      //   );
      // } catch (e) {
      //   // Si l'account token associé n'existe pas, créez-le
      //   console.log("Associated token account does not exist. Creating...");
      //   const blockhash = await conn.getLatestBlockhash("finalized");
      //   const createTx = new Transaction({
      //     recentBlockhash: blockhash.blockhash,
      //     feePayer: wallet.publicKey,
      //   }).add(
      //     createAssociatedTokenAccountInstruction(
      //       wallet.publicKey,
      //       associatedTokenAccount,
      //       wallet.publicKey,
      //       mint
      //     )
      //   );

      //   const signedCreateTx = await wallet.signTransaction(createTx);
      //   const createTxid = await conn.sendRawTransaction(
      //     signedCreateTx.serialize()
      //   );
      //   await conn.confirmTransaction(createTxid);

      //   // Récupérez les informations de l'account token associé après création
      //   associatedTokenAccountInfo = await getAccount(
      //     conn,
      //     associatedTokenAccount
      //   );
      // }

      // // Vérifiez que l'owner de l'account token associé est correct
      // if (!associatedTokenAccountInfo.owner.equals(wallet.publicKey)) {
      //   throw new Error(
      //     `Incorrect owner for associated token account. Expected ${wallet.publicKey.toBase58()} but found ${associatedTokenAccountInfo.owner.toBase58()}`
      //   );
      // }

      // Obtenez le blockhash pour la nouvelle transaction
      const blockhash = await conn.getLatestBlockhash("finalized");

      // Mint des tokens
      // const tx2 = new Transaction({
      //   recentBlockhash: blockhash.blockhash,
      //   feePayer: wallet.publicKey,
      // });

      // await program.rpc.mintTokensToUser(amount, {
      //   accounts: {
      //     mintAuthority: walletKP.publicKey,
      //     recipient: accounts[0],
      //     mintAccount: mint,
      //     associatedTokenAccount: associatedTokenAccount,
      //     tokenProgram: TOKEN_PROGRAM_ID,
      //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      //     systemProgram: SystemProgram.programId,
      //   },
      // });

      const tx = await program.methods
        .mintTokensToUser(amount)
        .accounts(
          {
            mintAuthority: walletKP.publicKey,
            recipient: walletKP.publicKey,
            mintAccount: mint,
            associatedTokenAccount: associatedTokenAccount,

          })
        .signers([walletKP])
        .rpc();


      // const instruction = program.instruction.mintTokensToUser(new anchor.BN(amount), {
      //   accounts: {
      //     mintAuthority: mintAuthority.publicKey,
      //     recipient: wallet.publicKey,
      //     mintAccount: mint,
      //     associatedTokenAccount: associatedTokenAccount,
      //     tokenProgram: TOKEN_PROGRAM_ID,
      //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      //     systemProgram: SystemProgram.programId,
      //   },
      // });

      // tx2.add(instruction);

      // // Ajoutez mintAuthority comme signataire
      // tx2.partialSign(mintAuthority);

      // // Signez et envoyez la transaction de mint
      // const signedTx2 = await wallet.signTransaction(tx2);
      // const txid2 = await conn.sendRawTransaction(signedTx2.serialize());
      // await conn.confirmTransaction(txid2);

      // return txid2;
      return '';
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      throw error;
    }
  };

  mintGemsTest = async (quantity: number): Promise<void> => {


    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const ENV_DEPLOYER_PRIVATE_KEY = "5goreipUSyZ3eV4Qxi4b4kdfuZo18mKczha6cmTV2FdFshRkLNhwDsvN6H9WTNr7VsW6V8KzyihANZ7BHv52RgpV";

    // Set Wallet that will be the admin of the program
    const walletKP = Keypair.fromSecretKey(new Uint8Array(bs58.decode(ENV_DEPLOYER_PRIVATE_KEY)));


    // Load the program
    // const fs = require('fs');
    // const idlRaw = fs.readFileSync('../lib/idl_test.json', 'utf8');
    // const idl = JSON.parse(idlRaw);
    const idl = { "address": "9w1KrVJaq6G9ogtLCsiPjKSAC5Ag3DZsbSXkXgdYmsN3", "metadata": { "name": "gemquest", "version": "0.1.0", "spec": "0.1.0", "description": "Created with Anchor" }, "instructions": [{ "name": "create_nft", "discriminator": [231, 119, 61, 97, 217, 46, 142, 109], "accounts": [{ "name": "payer", "writable": true, "signer": true }, { "name": "metadata_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [109, 101, 116, 97, 100, 97, 116, 97] }, { "kind": "account", "path": "token_metadata_program" }, { "kind": "account", "path": "mint_account" }], "program": { "kind": "account", "path": "token_metadata_program" } } }, { "name": "edition_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [109, 101, 116, 97, 100, 97, 116, 97] }, { "kind": "account", "path": "token_metadata_program" }, { "kind": "account", "path": "mint_account" }, { "kind": "const", "value": [101, 100, 105, 116, 105, 111, 110] }], "program": { "kind": "account", "path": "token_metadata_program" } } }, { "name": "mint_account", "writable": true, "signer": true }, { "name": "associated_token_account", "writable": true, "pda": { "seeds": [{ "kind": "account", "path": "payer" }, { "kind": "const", "value": [6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140, 245, 133, 126, 255, 0, 169] }, { "kind": "account", "path": "mint_account" }], "program": { "kind": "const", "value": [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89] } } }, { "name": "token_program", "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { "name": "token_metadata_program", "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" }, { "name": "associated_token_program", "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" }, { "name": "system_program", "address": "11111111111111111111111111111111" }, { "name": "rent", "address": "SysvarRent111111111111111111111111111111111" }], "args": [{ "name": "nft_name", "type": "string" }, { "name": "nft_symbol", "type": "string" }, { "name": "nft_uri", "type": "string" }] }, { "name": "create_token", "discriminator": [84, 52, 204, 228, 24, 140, 234, 75], "accounts": [{ "name": "payer", "writable": true, "signer": true }, { "name": "mint_account", "writable": true, "signer": true }, { "name": "metadata_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [109, 101, 116, 97, 100, 97, 116, 97] }, { "kind": "account", "path": "token_metadata_program" }, { "kind": "account", "path": "mint_account" }], "program": { "kind": "account", "path": "token_metadata_program" } } }, { "name": "token_program", "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { "name": "token_metadata_program", "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" }, { "name": "system_program", "address": "11111111111111111111111111111111" }, { "name": "rent", "address": "SysvarRent111111111111111111111111111111111" }], "args": [{ "name": "token_name", "type": "string" }, { "name": "token_symbol", "type": "string" }, { "name": "token_uri", "type": "string" }] }, { "name": "initialize_program", "discriminator": [176, 107, 205, 168, 24, 157, 175, 103], "accounts": [{ "name": "payer", "writable": true, "signer": true }, { "name": "program_admin", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [112, 114, 111, 103, 114, 97, 109, 95, 97, 100, 109, 105, 110] }] } }, { "name": "system_program", "address": "11111111111111111111111111111111" }], "args": [] }, { "name": "initialize_user_account", "discriminator": [131, 248, 61, 211, 152, 205, 122, 238], "accounts": [{ "name": "user_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [117, 115, 101, 114, 95, 97, 99, 99, 111, 117, 110, 116] }, { "kind": "account", "path": "user" }] } }, { "name": "admin", "writable": true, "signer": true }, { "name": "user" }, { "name": "system_program", "address": "11111111111111111111111111111111" }, { "name": "rent", "address": "SysvarRent111111111111111111111111111111111" }], "args": [] }, { "name": "mint_tokens_to_user", "discriminator": [85, 150, 103, 133, 240, 87, 44, 73], "accounts": [{ "name": "mint_authority", "writable": true, "signer": true }, { "name": "recipient" }, { "name": "mint_account", "writable": true }, { "name": "associated_token_account", "writable": true, "pda": { "seeds": [{ "kind": "account", "path": "recipient" }, { "kind": "const", "value": [6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140, 245, 133, 126, 255, 0, 169] }, { "kind": "account", "path": "mint_account" }], "program": { "kind": "const", "value": [140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216, 219, 233, 248, 89] } } }, { "name": "token_program", "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { "name": "associated_token_program", "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" }, { "name": "system_program", "address": "11111111111111111111111111111111" }], "args": [{ "name": "amount", "type": "u64" }] }], "accounts": [{ "name": "ProgramAdmin", "discriminator": [93, 130, 19, 193, 29, 34, 250, 140] }, { "name": "UserAccount", "discriminator": [211, 33, 136, 16, 186, 110, 242, 127] }], "errors": [{ "code": 6000, "name": "AlreadyInitialized", "msg": "Program is already initialized" }], "types": [{ "name": "ProgramAdmin", "type": { "kind": "struct", "fields": [{ "name": "admin", "type": "pubkey" }, { "name": "is_initialized", "type": "bool" }] } }, { "name": "UserAccount", "type": { "kind": "struct", "fields": [{ "name": "authority", "type": "pubkey" }] } }] }

    const program = new anchor.Program(idl as any, this.provider);

    const MINT_TOKEN_ACCOUNT = new PublicKey(
      "BuLVCNeFRVfPvqj5ov9Vo4CNyWeRDwJa7Lj65bFQd117"
    );

    const solanaWallet = new SolanaWallet(this.provider);

    const accounts = await solanaWallet.requestAccounts();

    const USER_1 = new PublicKey(accounts[0]);

    // const connectionConfig = await solanaWallet.request<
    //   string[],
    //   CustomChainConfig
    // >({
    //   method: "solana_provider_config",
    //   params: [],
    // });
    // const connection = new Connection(connectionConfig.rpcTarget);

    // const block = await connection.getLatestBlockhash("finalized");

    // const TransactionInstruction = SystemProgram.transfer({
    //   fromPubkey: new PublicKey(accounts[0]),
    //   toPubkey: new PublicKey(accounts[0]),
    //   lamports: 0.01 * LAMPORTS_PER_SOL,
    // });


    // Derive the associated token address account for the mint and payer.
    // const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, user1.publicKey);
    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(MINT_TOKEN_ACCOUNT, USER_1);
    // const associatedTokenAccountAddress = getAssociatedTokenAddressSync(mintPubkey, user1.publicKey);

    // Amount of tokens to mint.
    const amount = new anchor.BN(quantity);

    // Mint the tokens to the associated token account.

    await program.rpc.mintTokensToUser(amount, {
      accounts: {
        mintAuthority: walletKP.publicKey,
        recipient: USER_1,
        mintAccount: MINT_TOKEN_ACCOUNT,
        associatedTokenAccount: associatedTokenAccountAddress,
      },
    });

    // const transactionSignature = await program.methods
    //   .mintTokensToUser(amount)
    //   .accounts({
    //     mintAuthority: admin.publicKey,
    //     recipient: USER_1.publicKey,
    //     mintAccount: MINT_TOKEN_ACCOUNT.publicKey,
    //     // mintAccount: mintPubkey,
    //     associatedTokenAccount: associatedTokenAccountAddress,
    //   })
    //   .rpc();

    const postBalance = (
      await provider.connection.getTokenAccountBalance(associatedTokenAccountAddress)
    ).value.uiAmount;

    console.log("new balance: ", postBalance);
  };
}
