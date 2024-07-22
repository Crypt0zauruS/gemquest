export const sciFiThemes = [
  "Star Trek",
  "Stargate",
  "Battlestar Galactica",
  "Star Wars",
  "The Expanse",
  "Doctor Who",
  "Babylon 5",
  "Farscape",
  "Firefly",
  "Dune",
  "Blade Runner",
  "The Matrix",
  "Terminator",
  "Alien",
  "Predator",
  "X-Files",
  "Black Mirror",
  "Westworld",
];

export const generateQuizPrompt = (theme, difficulty) => `
Generate an ${difficulty} level quiz on the theme "${theme}" with the following structure. Make sure that the expert level questions are extremely difficult and challenging, requiring deep knowledge of the subject:
{
  provider: "OpenAI",
  topic: "${theme} Quiz with an ${difficulty} difficulty powered by OpenAI",
  quizz: {
    ensign: [
      {
        id: 0,
        question: "Question 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      },
      {
        id: 1,
        question: "Question 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      },
      {
        id: 2,
        question: "Question 3?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      }
    ],
    captain: [
      {
        id: 0,
        question: "Question 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      },
      {
        id: 1,
        question: "Question 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      },
      {
        id: 2,
        question: "Question 3?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      }
    ],
    admiral: [
      {
        id: 0,
        question: "Question 1?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      },
      {
        id: 1,
        question: "Question 2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      },
      {
        id: 2,
        question: "Question 3?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Randomly select one of the options"
      }
    ]
  }
}`;

export const messageToSign = `
By signing this message, you acknowledge and agree to the following:
You can earn Gems by participating in quizzes while waiting in lines at the amusement park. These Gems can be exchanged for reward NFTs.
Reward NFTs offer perks like Skip the Line passes, VIP access, free drinks, snacks, and exclusive merchandise.
You can purchase entry tickets and other items on the GemQuest Marketplace.
Legal Disclaimer:
The developers of GemQuest are not responsible for any losses incurred during the use of the platform.
All transactions are final and non-refundable.
Ensure the security of your wallet and private keys; the developers are not liable for any unauthorized access.
By signing below, you accept and understand these terms.`;

export const ipfsGateway =
  "https://fuchsia-varying-camel-696.mypinata.cloud/ipfs/";

export const tokenMetadataProgramId =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

export const gemAddresses = {
  1: "tbvf6yzmE1R9tDuURQBVELZk2ZvTgyw2jviGUhhuXEe",
  5: "893PfYNhkG9d1gXHDzQ6oE2e9LkVMqHXCs7gNJa4Cokt",
  10: "9hpPeP5eNB2AXYCfJZcoSWT7kQUhNVgv3t3UYgwgaAeG",
  20: "4MvmUpjFAye1dL23Pa7GpbNvAEaFiyWho7arHFNJKmko",
};

export const gemMetadataAccounts = {
  1: "FPyhUWkrc24QwWmvzbzW4eRgrkQ16yV7d35K3jz5mFgx",
  5: "AuHqs1HUMQWQnu4v3ztxwoWPHdXvM8k6SKHjooTDNgJi",
  10: "HznnZoQtx1VDThb54fw1LNNAVbJxbTMDzKkHgSjxXPx7",
  20: "AYpwBTDwDx9RKABQtEqanwFQCmb7Krv3AbPhbyP5QGfV",
};

export const nftMetadata = [
  {
    name: "Exclusive Event Access",
    symbol: "GQEEA",
    address: "DxmsGQQ6ffHAsETm8FjC1pmxF7veRUibNxPP1QbopNA1",
    ATA: "75fWFz26yBixwbLwQRYnArauefV1P2ZxmahdWhGy5AAo",
    metadataAccount: "5GsrjCwgJpfCZ9QeBcgvLQU3xd5GDRA6uF5mnhChZgJd",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQEEA.json",
  },
  {
    name: "Free Drink",
    symbol: "GQFD",
    address: "8g9AmZM81qcSNDemEnekUsDNeSTg7EpMFEcXuw22m54M",
    ATA: "BrkfQJrGUNLmrouM3vs9fMykQDL6H5Es4tK6got1Bssa",
    metadataAccount: "485X5NWNGubzVTzbCJnxQ9xKEA9pxzMsNRC2ta2dMrFg",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFD.json",
  },
  {
    name: "Free Snack",
    symbol: "GQFS",
    address: "813dVg8m1PWcD3oyR2VtGXGjGd1BePVvEGDLqyYfq8SN",
    ATA: "62LFVb5x2nnuzcBHtVBLwju4mF1TUmaCfA88oJiJQRdT",
    metadataAccount: "8SMNVs8LzzTzd5wqQSfrLGRQpDrDU3pAA6s1uWNQPdpy",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFS.json",
  },
  {
    name: "Free Snack",
    symbol: "GQFS",
    address: "B4sZuu2gzqQ9kJWotZgaWwWJ3KT1GGSGqY8AcapSk4fJ",
    ATA: "6AEdp93MuWnSzwSwWh9WS8hTEeUGmXQTbKCbiM5xSRQi",
    metadataAccount: "HCDfx893W5gLWP1uX2R7Lchf3SnF3NG41F8K9Zv5pKkT",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFS.json",
  },
  {
    name: "Gift Cap",
    symbol: "GQGC",
    address: "G78BVARH5fHjE6YEghMLuDLPFCKDY5SdqCZmifrvqMkJ",
    ATA: "5yFPYc5h1s2sFSCyfDWzCGjue68N2KHyPZ5jVwoSpDrL",
    metadataAccount: "3ouT1BbpXsuNHK9z3wCJzajNV1F2KV2xWYgVvLDhBorR",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGC.json",
  },
  {
    name: "Gift Photo",
    symbol: "GQGP",
    address: "HGLPK7aJ346Nr8ygGta3mFcuG1cu794E9moPWSLy9wA8",
    ATA: "13EC3ucZGS1fG6ukTq3wEuNZuTamHFvjPGBUzc8Ad7Wx",
    metadataAccount: "EqsTupC1kFfSdSU2k59y22tJwZgcCxJU88DU86xqc1CT",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGP.json",
  },
  {
    name: "Gift Shop",
    symbol: "GQGS",
    address: "D4YYyyUJ7fp5hS4JrSJF86aTivfmRVeVfsotVr6zdfJm",
    ATA: "ApdCs1mYA4AbtYa6ANqvG5mW7aJP1jDaDEy7Pnj7JRaW",
    metadataAccount: "Bs7sE3a5qHvPoxuzddCCmHUhpTR28ak8dw49p5mqu8sh",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGS.json",
  },
  {
    name: "Skip the Line",
    symbol: "GQSKL",
    address: "JAmawf378WGtcA82aq4ijYsRZP3Pv3jKEs5CuWBNZefb",
    ATA: "4b46KfVxZRuiH6sJSCToNRvNuCvjKuqKfAabCGm329QA",
    metadataAccount: "H3Yad42gCT55WVFK7AiZzygBYDh8NSNGLsA2HRaPSGfk",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQSKL.json",
  },
  {
    name: "Gift T-shirt",
    symbol: "GQTS",
    address: "Gmwz2SMSV5ZNot23KQSAmSYM3KtTzsCJKgQQAfh3BKL7",
    ATA: "HLBgdeZ2n6sDsfcwYGgY4fTqiJhXnKPK5HghAS7utJwX",
    metadataAccount: "3JAgkQTfk1kZg1EfnVw6XMwvJbCRt6cf4FaLBTVA78YS",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQTS.json",
  },
  {
    name: "VIP Access",
    symbol: "GQVIP",
    address: "BzwiZAb7FQYuWSE3Ztv1sNNHMDYVRQqPEuLTZgETjtqZ",
    ATA: "7gGr5NZjQqArQGQ4h5de4WuA5ypJT2uaUxtaPdQJotb2",
    metadataAccount: "BMmk6JnkYFtY6Kx3fcfAN5a5yJSMYadCyMNPJ8ZkEFAy",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQVIP.json",
  },
];
