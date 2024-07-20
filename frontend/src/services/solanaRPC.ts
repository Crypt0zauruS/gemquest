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
import idl from "../lib/idl_test.json";
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




    const ENV_DEPLOYER_PRIVATE_KEY = "5goreipUSyZ3eV4Qxi4b4kdfuZo18mKczha6cmTV2FdFshRkLNhwDsvN6H9WTNr7VsW6V8KzyihANZ7BHv52RgpV";
    const walletKP = Keypair.fromSecretKey(new Uint8Array(bs58.decode(ENV_DEPLOYER_PRIVATE_KEY)));

    console.log("signer:", walletKP.publicKey.toBase58());
    console.log("user:", accounts[0]);

    const wallett = {
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

    // const wa = new Wallet(walletKP);
    // const wallettd = new anchor.Wallet(walletKP);
    const provider = new anchor.AnchorProvider(conn, walletKP as any, {
      preflightCommitment: "finalized",
    });
    anchor.setProvider(provider);
    const program = new anchor.Program(idl as any, provider);

    // const program = new anchor.Program(idl as any, programId, provider);
    // const program = new anchor.Program(idl as any, programId, provider);
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

    const instruction = program.instruction.mintTokensToUser(new anchor.BN(amount), {
      accounts: {
        mintAuthority: provider.wallet.publicKey,
        recipient: accounts[0],
        mintAccount: mint,
        associatedTokenAccount: associatedTokenAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    });

    const tx2 = new Transaction({
      recentBlockhash: blockhash.blockhash,
      feePayer: provider.wallet.publicKey,
    });
    tx2.add(instruction);



    const transaction = new Transaction().add(
      instruction
    );

    console.log("sending Transaction:", transaction);
    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
      conn,
      transaction,
      [walletKP],
    );

    console.log('SIGNATURE', signature);
    console.log("BRAVO !");
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

  };

  mintGemsTest = async (amount: number): Promise<string> => {

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
    var userWallet = accounts[0];

    const ENV_DEPLOYER_PRIVATE_KEY = ""; // Set your private key here
    const adminWallet = Keypair.fromSecretKey(new Uint8Array(bs58.decode(ENV_DEPLOYER_PRIVATE_KEY)));

    console.log("signer:", adminWallet.publicKey.toBase58());
    console.log("user:", userWallet);

    const wallett = {
      signTransaction: async (tx: Transaction) => {
        const signedTx = await solanaWallet.signTransaction(tx);
        return signedTx;
      },
      publicKey: adminWallet,
    };

    const provider = new anchor.AnchorProvider(conn, adminWallet as any, {
      preflightCommitment: "finalized",
    });
    anchor.setProvider(provider);
    const program = new anchor.Program(idl as any, provider);

    console.log(program.programId.toBase58());;

    const mint = new PublicKey(
      "BuLVCNeFRVfPvqj5ov9Vo4CNyWeRDwJa7Lj65bFQd117"
    );

    const associatedTokenAccount = getAssociatedTokenAddressSync(mint, new PublicKey(userWallet));
    console.log(associatedTokenAccount.toBase58());

    const instruction = program.instruction.mintTokensToUser(new anchor.BN(amount), {
      accounts: {
        mintAuthority: provider.wallet.publicKey,
        recipient: userWallet,
        mintAccount: mint,
        associatedTokenAccount: associatedTokenAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    });

    const transaction = new Transaction().add(
      instruction
    );

    console.log("sending Transaction:", transaction);

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
      conn,
      transaction,
      [adminWallet],
    );

    console.log('SIGNATURE', signature);
    console.log("BRAVO !");

    return '';

  };
}
