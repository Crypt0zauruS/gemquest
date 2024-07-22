import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { CustomChainConfig, IProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
import idl from "../lib/gemquest.json";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  unpackAccount,
} from "@solana/spl-token";
import bs58 from "bs58";
import { AnchorProvider, BN, Program, setProvider, web3 } from "@coral-xyz/anchor";
import {
  mplTokenMetadata,
  fetchDigitalAssetByMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  gemAddresses,
  gemMetadataAccounts,
  nftMetadata,
  ipfsGateway,
  tokenMetadataProgramId
} from "../utils";

export default class SolanaRpc {
  private provider: IProvider;
  umi: any;

  constructor(provider: IProvider) {
    this.provider = provider;
    this.umi = createUmi("https://api.devnet.solana.com").use(
      mplTokenMetadata()
    );
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
      const res = await solanaWallet.signMessage(msg as any);
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

  mintGems = async (amount: number, mintAddress: string): Promise<string> => {
    const users = await this.getAccounts();
    const userWallet = users[0];
    const connectionConfig = {
      rpcTarget: "https://api.devnet.solana.com",
    };
    const conn = new Connection(connectionConfig.rpcTarget);
    // Récupérez la clé privée de l'API
    const response = await fetch("/api/getKey", { method: "POST" });
    const data = await response.json();
    // Décodez la clé privée de adminWallet
    const adminWalletSecretKey = bs58.decode(data.privateKey);
    const adminWallet = Keypair.fromSecretKey(adminWalletSecretKey);
    const provider = new AnchorProvider(conn, adminWallet as any, {
      preflightCommitment: "finalized",
    });
    setProvider(provider);
    const program = new Program(idl as any, provider);

    const mint = new PublicKey(mintAddress);

    const associatedTokenAccount = getAssociatedTokenAddressSync(
      mint,
      new PublicKey(userWallet as string)
    );

    console.table({
      programId: program.programId.toBase58(),
      userWallet: userWallet,
      signer: adminWallet.publicKey.toBase58(),
      mint: mint.toBase58(),
      associatedTokenAccount: associatedTokenAccount.toBase58(),
    });

    const instruction = program.instruction.mintTokensToUser(new BN(amount), {
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

    const { blockhash } = await conn.getRecentBlockhash("finalized");

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: adminWallet.publicKey,
    }).add(instruction);

    const signature = await sendAndConfirmTransaction(conn, transaction, [
      adminWallet,
    ]);
    console.log("Transaction confirmed:", signature);
    return signature;
  };

  fetchGems = async (): Promise<{ [key: string]: number }> => {
    try {
      const users = await this.getAccounts();
      const connectionConfig = {
        rpcTarget: "https://api.devnet.solana.com",
      };
      const conn = new Connection(connectionConfig.rpcTarget);
      const userWallet = new PublicKey(users[0]);

      const getTokenBalance = async (mintAddress: PublicKey) => {
        const associatedTokenAccount = await PublicKey.findProgramAddress(
          [
            userWallet.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(),
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const tokenAccountInfo = await conn.getAccountInfo(
          associatedTokenAccount[0]
        );
        if (!tokenAccountInfo) return 0;

        const amount = tokenAccountInfo.data.readUIntLE(64, 8);
        return amount / LAMPORTS_PER_SOL;
      };

      const gem1Balance = await getTokenBalance(new PublicKey(gemAddresses[1]));
      const gem5Balance = await getTokenBalance(new PublicKey(gemAddresses[5]));
      const gem10Balance = await getTokenBalance(
        new PublicKey(gemAddresses[10])
      );
      const gem20Balance = await getTokenBalance(
        new PublicKey(gemAddresses[20])
      );

      return {
        gem1: gem1Balance,
        gem5: gem5Balance,
        gem10: gem10Balance,
        gem20: gem20Balance,
      };
    } catch (error) {
      console.error("Failed to fetch user gems:", error);
      throw error;
    }
  };

  fetchGemsMetadata = async (): Promise<{ [key: string]: any }> => {
    try {
      const getMetadata = async (metadataAccount: string) => {
        const metadataPDA: any = [new PublicKey(metadataAccount), 0];
        const asset = await fetchDigitalAssetByMetadata(this.umi, metadataPDA);
        return asset;
      };
      const fetchJsonFromIpfs = async (url: string) => {
        const response = await fetch(url.replace("ipfs://", ipfsGateway));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      };

      const gem1Metadata = await getMetadata(gemMetadataAccounts[1]);
      const gem5Metadata = await getMetadata(gemMetadataAccounts[5]);
      const gem10Metadata = await getMetadata(gemMetadataAccounts[10]);
      const gem20Metadata = await getMetadata(gemMetadataAccounts[20]);

      const gemsMetadataUrls = {
        gem1: gem1Metadata.metadata.uri,
        gem5: gem5Metadata.metadata.uri,
        gem10: gem10Metadata.metadata.uri,
        gem20: gem20Metadata.metadata.uri,
      };

      const gem1Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem1);
      const gem5Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem5);
      const gem10Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem10);
      const gem20Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem20);

      return {
        gem1: gem1Data,
        gem5: gem5Data,
        gem10: gem10Data,
        gem20: gem20Data,
      };
    } catch (error) {
      console.error("Failed to fetch gems metadata:", error);
      throw error;
    }
  };

  fetchNFT = async (): Promise<{ [key: string]: any }> => {
    try {
      const getMetadata = async (metadataAccount: string) => {
        const metadataPDA: any = [new PublicKey(metadataAccount), 0];
        const asset = await fetchDigitalAssetByMetadata(this.umi, metadataPDA);
        return asset;
      };

      const fetchJsonFromIpfs = async (url: string) => {
        const response = await fetch(url.replace("ipfs://", ipfsGateway));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      };

      const metadata = await Promise.all(
        nftMetadata.map(async (nft) => {
          const metadataInfo = await getMetadata(nft.metadataAccount);
          const metadataUri = metadataInfo.metadata.uri;
          const metadataJson = await fetchJsonFromIpfs(metadataUri);
          return { ...nft, metadata: metadataJson };
        })
      );

      const metadataMap: { [key: string]: any } = {};
      metadata.forEach((nft) => {
        metadataMap[nft.symbol] = nft.metadata;
      });

      return metadataMap;
    } catch (error) {
      console.error("Failed to fetch NFT metadata:", error);
      throw error;
    }
  };

  approveTokenBurn = async (nft_price: number): Promise<string> => {

    const solanaWallet = new SolanaWallet(this.provider);
    const users = await this.getAccounts();
    const userWallet = users[0];
    const connectionConfig = {
      rpcTarget: "https://api.devnet.solana.com",
    };
    const conn = new Connection(connectionConfig.rpcTarget);
    // Récupérez la clé privée de l'API
    const response = await fetch("/api/getKey", { method: "POST" });
    const data = await response.json();
    // Décodez la clé privée de adminWallet
    const adminWalletSecretKey = bs58.decode(data.privateKey);
    const adminWallet = Keypair.fromSecretKey(adminWalletSecretKey);

    const provider = new AnchorProvider(conn, adminWallet as any, {
      preflightCommitment: "finalized",
    });
    const program = new Program(idl as any, provider);
    setProvider(provider);

    const NFT_PRICE = nft_price * web3.LAMPORTS_PER_SOL;
    console.log("NFT_PRICE", NFT_PRICE);

    const MINT_TOKEN_ACCOUNT = new PublicKey(gemAddresses[1]);

    // const userTokenATA = getAssociatedTokenAddressSync(
    //   MINT_TOKEN_ACCOUNT,
    //   new PublicKey(userWallet)
    // );

    const userTokenATA = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      adminWallet, // Payer
      MINT_TOKEN_ACCOUNT,
      new PublicKey(userWallet)
    );

    // Give allowance to admin to burn user token
    const instructionApproveToken = await program.instruction
      .approveToken(new BN(NFT_PRICE),
        {
          accounts: {

            associatedTokenAccount: userTokenATA.address,

            delegate: adminWallet.publicKey,
            authority: userWallet,

            // system
            tokenProgram: TOKEN_PROGRAM_ID,
          }
        });


    const latestBlockhashInfo = await conn.getLatestBlockhash("finalized");

    const transactionApprove = new Transaction({
      blockhash: latestBlockhashInfo.blockhash,
      feePayer: new PublicKey(userWallet),
      lastValidBlockHeight: latestBlockhashInfo.lastValidBlockHeight,
    }).add(instructionApproveToken);


    // Using web3auth wallet to sign the transaction
    const signedTx = await solanaWallet.signAndSendTransaction(transactionApprove);

    console.log("Approve Token Transaction confirmed:", signedTx);

    const accountInfo = await program.provider.connection.getAccountInfo(userTokenATA.address);
    const uAccount = unpackAccount(userTokenATA.address, accountInfo, TOKEN_PROGRAM_ID);

    console.log("Token delegated of user wallet:", uAccount.delegatedAmount.toString());

    return signedTx?.signature;
  };


  checkApproveToken = async (): Promise<void> => {

    const solanaWallet = new SolanaWallet(this.provider);
    const users = await this.getAccounts();
    const userWallet = users[0];
    const connectionConfig = {
      rpcTarget: "https://api.devnet.solana.com",
    };
    const conn = new Connection(connectionConfig.rpcTarget);
    // Récupérez la clé privée de l'API
    const response = await fetch("/api/getKey", { method: "POST" });
    const data = await response.json();
    // Décodez la clé privée de adminWallet
    const adminWalletSecretKey = bs58.decode(data.privateKey);
    const adminWallet = Keypair.fromSecretKey(adminWalletSecretKey);

    const provider = new AnchorProvider(conn, adminWallet as any, {
      preflightCommitment: "finalized",
    });
    const program = new Program(idl as any, provider);
    setProvider(provider);

    const MINT_TOKEN_ACCOUNT = new PublicKey(gemAddresses[1]);
    const userTokenATA = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      adminWallet, // Payer
      MINT_TOKEN_ACCOUNT,
      new PublicKey(userWallet)
    );

    const accountInfo = await program.provider.connection.getAccountInfo(userTokenATA.address);
    const uAccount = unpackAccount(userTokenATA.address, accountInfo, TOKEN_PROGRAM_ID);

    console.log("Token delegated of user wallet:", uAccount.delegatedAmount.toString());
  };

  burnTokenTransferNFTd = async (nftTokenAddr: string, nft_price: number): Promise<string> => {
    const solanaWallet = new SolanaWallet(this.provider);
    const users = await this.getAccounts();
    const userWallet = users[0];
    const connectionConfig = {
      rpcTarget: "https://api.devnet.solana.com",
    };
    const conn = new Connection(connectionConfig.rpcTarget);
    // Récupérez la clé privée de l'API
    const response = await fetch("/api/getKey", { method: "POST" });
    const data = await response.json();
    // Décodez la clé privée de adminWallet
    const adminWalletSecretKey = bs58.decode(data.privateKey);
    const adminWallet = Keypair.fromSecretKey(adminWalletSecretKey);

    const provider = new AnchorProvider(conn, adminWallet as any, {
      preflightCommitment: "finalized",
    });
    const program = new Program(idl as any, provider);
    setProvider(provider);


    const NFT_PRICE = nft_price * web3.LAMPORTS_PER_SOL;
    console.log("NFT_PRICE", NFT_PRICE);

    const MINT_NFT_ACCOUNT = new PublicKey(nftTokenAddr);

    // const userNftATA = getAssociatedTokenAddressSync(
    //   MINT_NFT_ACCOUNT,
    //   new PublicKey(userWallet)
    // );

    const userNftATA = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      adminWallet, // Payer
      MINT_NFT_ACCOUNT,
      new PublicKey(userWallet)
    );

    const MINT_TOKEN_ACCOUNT = new PublicKey(gemAddresses[1]);

    // const userTokenATA = getAssociatedTokenAddressSync(
    //   MINT_TOKEN_ACCOUNT,
    //   new PublicKey(userWallet)
    // );

    const userTokenATA = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      adminWallet, // Payer
      MINT_TOKEN_ACCOUNT,
      new PublicKey(userWallet)
    );

    const adminNftATA = getAssociatedTokenAddressSync(
      MINT_NFT_ACCOUNT,
      adminWallet.publicKey
    );

    console.table({
      programId: program.programId.toBase58(),
      userWallet: userWallet,
      signer: adminWallet.publicKey.toBase58(),
      mintNftAccount: MINT_NFT_ACCOUNT.toBase58(),
      userNftATA: userNftATA.address.toBase58(),
      mintTokenAccount: MINT_TOKEN_ACCOUNT.toBase58(),
      userTokenATA: userTokenATA.address.toBase58(),
      adminNftATA: adminNftATA.toBase58(),
    });

    // Give allowance to admin to burn user token
    const instructionApproveToken = await program.instruction
      .approveToken(new BN(NFT_PRICE),
        {
          accounts: {

            associatedTokenAccount: userTokenATA.address,

            delegate: adminWallet.publicKey,
            authority: userWallet,

            // system
            tokenProgram: TOKEN_PROGRAM_ID,
          }
        });


    // User need to sign the approve transaction
    // const recentBlockhash = await conn.getRecentBlockhash("finalized");

    // const transactionApprove = new Transaction({
    //   recentBlockhash: recentBlockhash.blockhash,
    //   feePayer: new PublicKey(userWallet),
    // }).add(instructionApproveToken);


    const latestBlockhashInfo = await conn.getLatestBlockhash("finalized");

    const transactionApprove = new Transaction({
      blockhash: latestBlockhashInfo.blockhash,
      //   // recentBlockhash: blockhash,
      feePayer: new PublicKey(userWallet),
      lastValidBlockHeight: latestBlockhashInfo.lastValidBlockHeight,
    }).add(instructionApproveToken);


    // Using web3auth wallet to sign the transaction
    const signedTx = await solanaWallet.signAndSendTransaction(transactionApprove);

    console.log("Approve Token Transaction confirmed:", signedTx);

    const accountInfo = await program.provider.connection.getAccountInfo(userTokenATA.address);
    const uAccount = unpackAccount(userTokenATA.address, accountInfo, TOKEN_PROGRAM_ID);

    console.log("Token delegated of user wallet:", uAccount.delegatedAmount.toString());


    // Burn and mint NFT
    const instructionBurnTransfer = program.instruction.burnTokenTransferNft(new BN(NFT_PRICE), {
      accounts: {
        payer: adminWallet.publicKey,

        mintTokenAccount: MINT_TOKEN_ACCOUNT,
        associatedTokenAccount: userTokenATA.address,

        from: adminNftATA,
        to: userNftATA.address,

        fromAuthority: adminWallet.publicKey,

        // system
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });

    const blockhashInfo = await conn.getLatestBlockhash("finalized");

    const transaction = new Transaction({
      blockhash: blockhashInfo.blockhash,
      // recentBlockhash: blockhash,
      lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
      feePayer: adminWallet.publicKey,
    }).add(instructionBurnTransfer);

    const signature = await sendAndConfirmTransaction(conn, transaction, [
      adminWallet
    ]);
    console.log("Mint NFT Transaction confirmed:", signature);
    return signature;
  };


  burnTokenTransferNFT = async (nftTokenAddr: string, nft_price: number): Promise<string> => {
    const solanaWallet = new SolanaWallet(this.provider);
    const users = await this.getAccounts();
    const userWallet = users[0];
    const connectionConfig = {
      rpcTarget: "https://api.devnet.solana.com",
    };
    const conn = new Connection(connectionConfig.rpcTarget);
    // Récupérez la clé privée de l'API
    const response = await fetch("/api/getKey", { method: "POST" });
    const data = await response.json();
    // Décodez la clé privée de adminWallet
    const adminWalletSecretKey = bs58.decode(data.privateKey);
    const adminWallet = Keypair.fromSecretKey(adminWalletSecretKey);

    const provider = new AnchorProvider(conn, adminWallet as any, {
      preflightCommitment: "finalized",
    });
    const program = new Program(idl as any, provider);
    setProvider(provider);


    const NFT_PRICE = nft_price * web3.LAMPORTS_PER_SOL;
    console.log("NFT_PRICE", NFT_PRICE);

    const MINT_NFT_ACCOUNT = new PublicKey(nftTokenAddr);

    // const userNftATA = getAssociatedTokenAddressSync(
    //   MINT_NFT_ACCOUNT,
    //   new PublicKey(userWallet)
    // );

    const userNftATA = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      adminWallet, // Payer
      MINT_NFT_ACCOUNT,
      new PublicKey(userWallet)
    );

    const MINT_TOKEN_ACCOUNT = new PublicKey(gemAddresses[1]);

    // const userTokenATA = getAssociatedTokenAddressSync(
    //   MINT_TOKEN_ACCOUNT,
    //   new PublicKey(userWallet)
    // );

    const userTokenATA = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      adminWallet, // Payer
      MINT_TOKEN_ACCOUNT,
      new PublicKey(userWallet)
    );

    const adminNftATA = getAssociatedTokenAddressSync(
      MINT_NFT_ACCOUNT,
      adminWallet.publicKey
    );

    console.table({
      programId: program.programId.toBase58(),
      userWallet: userWallet,
      signer: adminWallet.publicKey.toBase58(),
      mintNftAccount: MINT_NFT_ACCOUNT.toBase58(),
      userNftATA: userNftATA.address.toBase58(),
      mintTokenAccount: MINT_TOKEN_ACCOUNT.toBase58(),
      userTokenATA: userTokenATA.address.toBase58(),
      adminNftATA: adminNftATA.toBase58(),
    });


    // Burn and mint NFT
    const instructionBurnTransfer = program.instruction.burnTokenTransferNft(new BN(NFT_PRICE), {
      accounts: {
        payer: adminWallet.publicKey,

        mintTokenAccount: MINT_TOKEN_ACCOUNT,
        associatedTokenAccount: userTokenATA.address,

        from: adminNftATA,
        to: userNftATA.address,

        fromAuthority: adminWallet.publicKey,

        // system
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });

    const blockhashInfo = await conn.getLatestBlockhash("finalized");

    const transaction = new Transaction({
      blockhash: blockhashInfo.blockhash,
      lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
      feePayer: adminWallet.publicKey,
    }).add(instructionBurnTransfer);

    const signature = await sendAndConfirmTransaction(conn, transaction, [
      adminWallet
    ]);
    console.log("Mint NFT Transaction confirmed:", signature);
    return signature;
  };
}
