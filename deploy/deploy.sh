#!/bin/bash

# Définition les variables nécessaires
ADMIN_KEYPAIR_PATH="~/.config/solana/id.json"
PARK_AUTHORITY_KEYPAIR_PATH="~/.config/solana/park_authority.json"
TREASURY_ACCOUNT_KEYPAIR_PATH="~/.config/solana/treasury_account.json"
DEVNET_URL="https://api.devnet.solana.com"
# LOCALNET_URL="http://localhost:8899"

# URLs JSON des gems metadata sur IPFS
GEM_METADATA_1="ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_1.json"
GEM_METADATA_5="ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_5.json"
GEM_METADATA_10="ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_10.json"
GEM_METADATA_20="ipfs://QmTNdfcWPYmYHrmDnWvXMyjDMYxApxGSGMA41LEYrz3uG9/gem_20.json"

# Airdrop des SOL pour couvrir les frais
solana airdrop 5 --url $DEVNET_URL --keypair $PARK_AUTHORITY_KEYPAIR_PATH
solana airdrop 5 --url $DEVNET_URL --keypair $ADMIN_KEYPAIR_PATH
solana airdrop 5 --url $DEVNET_URL --keypair $TREASURY_ACCOUNT_KEYPAIR_PATH
# solana airdrop 5 --url $LOCALNET_URL --keypair $PARK_AUTHORITY_KEYPAIR_PATH
# solana airdrop 5 --url $LOCALNET_URL --keypair $ADMIN_KEYPAIR_PATH
# solana airdrop 5 --url $LOCALNET_URL --keypair $TREASURY_ACCOUNT_KEYPAIR_PATH

# Créer les tokens avec park authority
TICKET_MINT=$(spl-token create-token --token-authority $PARK_AUTHORITY_KEYPAIR_PATH --url $DEVNET_URL | grep 'Creating token' | awk '{print $3}')
GEM_MINT=$(spl-token create-token --token-authority $PARK_AUTHORITY_KEYPAIR_PATH --url $DEVNET_URL | grep 'Creating token' | awk '{print $3}')
NFT_MINT=$(spl-token create-token --token-authority $PARK_AUTHORITY_KEYPAIR_PATH --url $DEVNET_URL | grep 'Creating token' | awk '{print $3}')

echo "Ticket Mint: $TICKET_MINT"
echo "Gem Mint: $GEM_MINT"
echo "NFT Mint: $NFT_MINT"

# Déployer le programme Anchor sur Devnet
anchor deploy --provider.cluster $DEVNET_URL
# anchor deploy --provider.cluster $LOCALNET_URL

# Initialiser le compte Quest avec les clés de mint
PROGRAM_ID=$(solana address -k target/deploy/gemquest-keypair.json)
ADMIN_PUBLIC_KEY=$(solana-keygen pubkey $ADMIN_KEYPAIR_PATH)
PARK_AUTHORITY_PUBLIC_KEY=$(solana-keygen pubkey $PARK_AUTHORITY_KEYPAIR_PATH)
TREASURY_ACCOUNT_PUBLIC_KEY=$(solana-keygen pubkey $TREASURY_ACCOUNT_KEYPAIR_PATH)
TICKET_MINT_PUBLIC_KEY=$(solana address -k $TICKET_MINT)
GEM_MINT_PUBLIC_KEY=$(solana address -k $GEM_MINT)
NFT_MINT_PUBLIC_KEY=$(solana address -k $NFT_MINT)

# Construire les données d'initialisation
INITIALIZATION_DATA=$(cat <<-END
{
    "admin": "$ADMIN_PUBLIC_KEY",
    "park_authority": "$PARK_AUTHORITY_PUBLIC_KEY",
    "gem_metadata_1": "$GEM_METADATA_1",
    "gem_metadata_5": "$GEM_METADATA_5",
    "gem_metadata_10": "$GEM_METADATA_10",
    "gem_metadata_20": "$GEM_METADATA_20",
    "treasury_account": "$TREASURY_ACCOUNT_PUBLIC_KEY"
}
END
)

# Envoyer la transaction d'initialisation
solana program invoke --program-id $PROGRAM_ID --keypair $ADMIN_KEYPAIR_PATH --url $DEVNET_URL --data "$INITIALIZATION_DATA"
# solana program invoke --program-id $PROGRAM_ID --keypair $ADMIN_KEYPAIR_PATH --url $LOCALNET_URL --data "$INITIALIZATION_DATA"

# TODO: Ajouter les commandes pour déployer le programme de quiz
# Récupérer sa pubkey
# Mettre à jour la pubkey du quiz via update_quiz_authority de gemquest
