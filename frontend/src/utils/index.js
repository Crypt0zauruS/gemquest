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

// Alex adresses
export const gemAddresses = {
  1: "tbvf6yzmE1R9tDuURQBVELZk2ZvTgyw2jviGUhhuXEe",
  5: "8hehtuBK7YCoyzXCVJmnubSjpRLeekgXWXQ21AhHbK49",
  10: "9h2ccTeZpFpBgPMzFFoRUT54173TnAKhEZaKxhuyGZzH",
  20: "A4e2eycpz8g7HuW8H7vtaNm3pySHGU7SKdd3RnQpUPKf",
};

export const gemMetadataAccounts = {
  1: "FPyhUWkrc24QwWmvzbzW4eRgrkQ16yV7d35K3jz5mFgx",
  5: "HWKQP6qn5GYk5RzgeLFEu7qXRS2Pt9v8f57xXYLhexCi",
  10: "H6K9DMEJdcSjKVt7RDqAH3LohJrZS2h48PCaRaMycKXs",
  20: "AYpwBTDwDx9RKABQtEqanwFQCmb7Krv3AbPhbyP5QGfV",
};

// Maxence adresses
// export const gemAddresses = {
//   1: "d7fmaicKsT7YvXjDg3NzLp8FvnSZXPiwTFqC8QdiyyU",
//   5: "9z2XXxCgQy7tf5zsmMBbggwZWiDqFexa5JtT3nxbSqW",
//   10: "B3tPLCZCn31iimk6GzSavqUzN12kiUbfxYjTiDNs86cn",
//   20: "BAQ7NE5emVFHjT5BhHVUxjxjCfX1SkjNsmVPJ34rHcYA",
// };

// export const gemMetadataAccounts = {
//   1: "83tFCpXxr7mm6E7ehkw9jLskTT6jr1u5apkaBtq7nBBy",
//   5: "GYFqqHY8HoSKbeLrnN9YGfQQG99qPypvYJpqqcBCrKAY",
//   10: "BbnZ17N4Xsp2H57vexbuY1CfbttaysCL4Js3i68hChNf",
//   20: "8a1qtqmbdsJaJnttQW298Jhny6DWzVw5BmDb1c7Ce36r",
// };

export const nftMetadata = [
  {
    name: "Exclusive Event Access",
    symbol: "GQEEA",
    address: "4jMh3wzpLnBsHRJ84KpjVimK5goSDMGJBnBJsA3z2LUe",
    ATA: "DzDJyp9EsGYZhkh5CqGxL34gGswrHwikALU7575xKQ2N",
    metadataAccount: "82TJvCpriaPey5ENgMJ9XHj3U1bWPBFb9UnrhRs2FBb",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQEEA.json",
  },
  {
    name: "Free Drink",
    symbol: "GQFD",
    address: "8UViAyErhbW4KidV9f6m7134ezLxFrKCRww8RmEQVxK8",
    ATA: "5vfDBGZ4X8r5KhqmZfi5o1trPkTQ6UW5u6auTP8HR9vF",
    metadataAccount: "BWKYC9VW958kBhsrPxcqbPHpPCw41XCq42nhkhx1o2cU",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFD.json",
  },
  // {
  //   name: "Free Snack",
  //   symbol: "GQFS",
  //   address: "DPSkb1ugFgUhZCkJswcB9aMbD85PC3JZ7gBd6unUiGG9",
  //   ATA: "BxSgMkMW9u8uUQGjNVwVSEJcEvppuCAJg551csAYQmEL",
  //   metadataAccount: "7MwXtgAnkR82pkDHnuWZo51CzWiSzeZfgDz1uE8FBxCi",
  //   uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFS.json",
  // },
  {
    name: "Free Snack",
    symbol: "GQFS",
    address: "813dVg8m1PWcD3oyR2VtGXGjGd1BePVvEGDLqyYfq8SN",
    ATA: "62LFVb5x2nnuzcBHtVBLwju4mF1TUmaCfA88oJiJQRdT",
    metadataAccount: "8SMNVs8LzzTzd5wqQSfrLGRQpDrDU3pAA6s1uWNQPdpy",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFS.json",
  },
  {
    name: "Gift Cap",
    symbol: "GQGC",
    address: "3BeVjMxTdjKmid127bVhW4nK1wZAXbv8sGVYkFt9YdeL",
    ATA: "E1TKnChYcLxsqrZx8E6jV68xFvjfmmktDArQfSb9yEVE",
    metadataAccount: "UdntcUey1RK8ALP5YZyWULyunNde9BnLh4SRbAvDFrc",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGC.json",
  },
  {
    name: "Gift Photo",
    symbol: "GQGP",
    address: "GEPsehBN63oj2nUMyMMdwbpr1KGpHDyqMhbZuaz1gaki",
    ATA: "9kaejJHUTaojc2G8hJkS95nRFx5YFjurc5y29FKq2k3",
    metadataAccount: "77iZnsRZNDQJWCCRXDDUCAe8WSps9k8TMiN1RadKwBLv",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGP.json",
  },
  {
    name: "Gift Shop",
    symbol: "GQGS",
    address: "77yV4YniWFAA4yvbssHKCi7ThVuMiiJy5CRVAvVCMGSe",
    ATA: "Haey9mMpsquugbTTLfFQ7r5gbD2U3gEUQjSqaJvUAvJH",
    metadataAccount: "3DEG5SYQMusrP5Curu9KN95zez2AnLsS1dkT6ek7rg4U",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGS.json",
  },
  {
    name: "Skip the Line",
    symbol: "GQSKL",
    address: "9g2dgioeCBv9uXAyAVDfXP8zSRGXEGXSKkKZs4Wy1Cyy",
    ATA: "HGpuMiw17zMCXvR5j5aDyBhmM6pxjnHSaMFf2uegcx8A",
    metadataAccount: "6BdVaGezt5B93BqQ6L8gKqBprfPQQSmPueCUzWLcW2WN",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQSKL.json",
  },
  {
    name: "Gift T-shirt",
    symbol: "GQTS",
    address: "fdEbne6JLLqudJMyFrDz68oGYpmSF38vnJyoKJJqxGD",
    ATA: "H7sGcT6LFLymbZUFHdxzHrvZqW3ztUrAjpt4Cd2inkev",
    metadataAccount: "AcAvwMhP6S1QzxNGNBeg4ivPNR3uVcoeHcGkHgHx4646",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQTS.json",
  },
  {
    name: "VIP Access",
    symbol: "GQVIP",
    address: "Bfy9PgUQk5Tg5NmJQDex7ZrNGTT1Uz321ob1U2W7RaeR",
    ATA: "9fHhu3m3C27fvjpHXU4TdWwymC26rLXtWizaYyrsoHT9",
    metadataAccount: "Bw7X532UPt98hu3gHkNnfG3oZ91GqgEQyMQ4ie2VApA7",
    uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQVIP.json",
  },
];
