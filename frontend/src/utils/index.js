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

export const ipfsGateway =
  "https://fuchsia-varying-camel-696.mypinata.cloud/ipfs/";

export const tokenMetadataProgramId =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
