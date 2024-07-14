# **GemQuest**

### **Description**

GemQuest est un programme Solana qui gère les gemmes et les NFT pour une quête de gemmes dans un parc d'attractions pendant les files d'attente. Les utilisateurs peuvent obtenir des gemmes en réussissant des quiz, échanger des gemmes contre des NFT de récompense, acheter des tickets de parc, activer des tickets de parc et brûler des NFT pour des récompenses.

#### **Table des matières**

- [Installation](#installation)
- [Structs](#structs)
- [Enums](#enums)
- [Accounts](#accounts)
- [Fonctions](#fonctions)
- [Erreurs](#erreurs)

#### **Installation**

Pour installer et déployer ce programme, suivez ces étapes :

1. Clonez ce dépôt.
2. Installez les dépendances avec Anchor et Cargo.
3. Déployez le programme sur le cluster Solana de votre choix.

anchor build

Script de déploiement

#### **Structs**

**Quest**

Représente la quête de gemmes.

- admin: Pubkey - Adresse de l'administrateur.
- nfts: Vec&lt;NftInfo&gt; - Liste des informations sur les NFT.
- ticket_mint: Pubkey - Adresse de mint des tickets.
- gem_mint: Pubkey - Adresse de mint des gemmes.
- nft_mint: Pubkey - Adresse de mint des NFT.
- total_gems: u64 - Nombre total de gemmes.
- ticket_price: u64 - Prix des tickets.
- quiz_authority: Pubkey - Adresse de l'autorité du quiz.
- gem_metadata_1: String - Métadonnées pour les gemmes de valeur 1.
- gem_metadata_5: String - Métadonnées pour les gemmes de valeur 5.
- gem_metadata_10: String - Métadonnées pour les gemmes de valeur 10.
- gem_metadata_20: String - Métadonnées pour les gemmes de valeur 20.
- burned_nfts: Vec&lt;BurnedNft&gt; - Liste des NFT brûlés.
- tokens: Vec&lt;TokenInfo&gt; - Liste des tokens générés.
- park_authority: Pubkey - Adresse de l'autorité du parc.
- treasury_account: Pubkey - Compte de la trésorerie.
- ticket_purchases_keys: Vec&lt;Pubkey&gt; - Clés des achats de tickets.
- ticket_purchases_data: Vec&lt;TicketPurchase&gt; - Données des achats de tickets.
- withdraw_authorized: bool - Indicateur d'autorisation de retrait.
- withdraw_requests: Vec&lt;WithdrawRequest&gt; - Liste des demandes de retrait.
- withdraw_authorizations: Vec&lt;WithdrawAuthorization&gt; - Liste des autorisations de retrait.

**Gems**

Représente les gemmes.

- metadata_uri: String - URI des métadonnées.
- amount: u64 - Quantité de gemmes.
- owner: Pubkey - Propriétaire des gemmes.
- value: u64 - Valeur des gemmes.

**GemsCount**

Représente le nombre de gemmes par type.

- gems_1: u64 - Nombre de gemmes de valeur 1.
- gems_5: u64 - Nombre de gemmes de valeur 5.
- gems_10: u64 - Nombre de gemmes de valeur 10.
- gems_20: u64 - Nombre de gemmes de valeur 20.

**Nft**

Représente un NFT.

- metadata_uri: String - URI des métadonnées.
- owner: Pubkey - Propriétaire du NFT.
- quantity: u64 - Quantité de NFT.
- status: NftStatus - Statut du NFT.
- activation_timestamp: i64 - Timestamp d'activation.
- ticket_id: u64 - Identifiant unique du ticket.

**BurnHistory**

Représente l'historique des NFT brûlés.

- burn_keys: Vec&lt;Pubkey&gt; - Clés des utilisateurs ayant brûlé des NFT.
- burn_data: Vec&lt;BurnedNft&gt; - Données des NFT brûlés.

**NftInfoWithIndex**

Représente les informations sur un NFT avec son index.

- index: u64 - Index du NFT.
- gem_cost: u64 - Coût en gemmes du NFT.
- metadata_uri: String - URI des métadonnées du NFT.

**NftInfo**

Représente les informations sur un NFT.

- gem_cost: u64 - Coût en gemmes du NFT.
- metadata_uri: String - URI des métadonnées du NFT.

**TicketPurchase**

Représente l'achat d'un ticket.

- timestamp: i64 - Timestamp de l'achat.
- user: Pubkey - Utilisateur ayant acheté le ticket.
- ticket_id: u64 - Identifiant unique du ticket.

**TokenInfo**

Représente un token généré pour utiliser un ticket ou un NFT.

- token: String - Token généré.
- user: Pubkey - Utilisateur possédant le token.
- nft_index: u64 - Index du NFT.
- expiration: i64 - Timestamp d'expiration du token.

**BurnedNft**

Représente un NFT brûlé.

- index: u64 - Index du NFT brûlé.
- user: Pubkey - Utilisateur ayant brûlé le NFT.
- timestamp: i64 - Timestamp de la brûlure.

**WithdrawRequest**

Représente une demande de retrait.

- timestamp: i64 - Timestamp de la demande.
- admin: Pubkey - Administrateur ayant fait la demande.
- amount: u64 - Montant à retirer.
- responded: bool - Indicateur de réponse à la demande.

**WithdrawAuthorization**

Représente une autorisation de retrait.

- timestamp: i64 - Timestamp de l'autorisation.
- treasury: Pubkey - Compte de la trésorerie.
- authorized: bool - Indicateur d'autorisation.

#### **Enums**

**NftStatus**

Représente le statut d'un ticket d'entrée.

- Inactive - Le NFT est inactif.
- Active - Le NFT est actif.
- Expired - Le NFT est expiré.

#### **Accounts**

**Initialize**

Contexte pour l'initialisation de la quête.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.
- system_program: Program&lt;'info, System&gt; - Programme système.
- rent: Sysvar&lt;'info, Rent&gt; - Variable système de loyer.
- burn_history: Account&lt;'info, BurnHistory&gt; - Compte d'historique de brûlure.

**UpdateQuizAuthority**

Contexte pour la mise à jour de l'autorité du quiz.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.

**GetTicketPrice**

Contexte pour récupérer le prix des tickets.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.

**MintGems**

Contexte pour la création des gemmes.

- gem_1: Account&lt;'info, Gems&gt; - Compte de gemmes de valeur 1.
- gem_5: Account&lt;'info, Gems&gt; - Compte de gemmes de valeur 5.
- gem_10: Account&lt;'info, Gems&gt; - Compte de gemmes de valeur 10.
- gem_20: Account&lt;'info, Gems&gt; - Compte de gemmes de valeur 20.
- gem_mint: AccountInfo&lt;'info&gt; - Compte de mint des gemmes.
- user_token_account: AccountInfo&lt;'info&gt; - Compte de token de l'utilisateur.
- park_authority: Signer&lt;'info&gt; - Compte de l'autorité du parc.
- user: Signer&lt;'info&gt; - Compte de l'utilisateur.
- token_program: Program&lt;'info, Token&gt; - Programme de token.
- system_program: Program&lt;'info, System&gt; - Programme système.
- rent: Sysvar&lt;'info, Rent&gt; - Variable système de loyer.
- user_ticket_account: Account&lt;'info, Nft&gt; - Compte de ticket de l'utilisateur.
- quiz_authority: Signer&lt;'info&gt; - Compte de l'autorité du quiz.
- quest: Account&lt;'info, Quest&gt; - Compte de quête.

**ExchangeGemsForNft**

Contexte pour échanger des gemmes contre un NFT.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- nft: Account&lt;'info, Nft&gt; - Compte de NFT.
- gem_mint: AccountInfo&lt;'info&gt; - Compte de mint des gemmes.
- user_gem_account: AccountInfo&lt;'info&gt; - Compte de gemmes de l'utilisateur.
- nft_mint: AccountInfo&lt;'info&gt; - Compte de mint des NFT.
- user_nft_account: AccountInfo&lt;'info&gt; - Compte de NFT de l'utilisateur.
- park_authority: Signer&lt;'info&gt; - Compte de l'autorité du parc.
- user: Signer&lt;'info&gt; - Compte de l'utilisateur.
- token_program: Program&lt;'info, Token&gt; - Programme de token.
- system_program: Program&lt;'info, System&gt; - Programme système.
- rent: Sysvar&lt;'info, Rent&gt; - Variable système de loyer.

**UpdateNft**

Contexte pour la mise à jour d'un NFT.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.

**GetBurnedNftsByUser**

Contexte pour récupérer les NFT brûlés par un utilisateur.

- burn_history: Account&lt;'info, BurnHistory&gt; - Compte d'historique de brûlure.

**AddNft**

Contexte pour ajouter un nouveau NFT.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.

**GetNftByIndex**

Contexte pour récupérer un NFT de récompense par index.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.

**MintParkTicket**

Contexte pour la création d'un ticket de parc.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- nft: Account&lt;'info, Nft&gt; - Compte de NFT.
- ticket_mint: AccountInfo&lt;'info&gt; - Compte de mint des tickets.
- user_token_account: AccountInfo&lt;'info&gt; - Compte de token de l'utilisateur.
- park_authority: Signer&lt;'info&gt; - Compte de l'autorité du parc.
- user: Signer&lt;'info&gt; - Compte de l'utilisateur.
- token_program: Program&lt;'info, Token&gt; - Programme de token.
- system_program: Program&lt;'info, System&gt; - Programme système.
- rent: Sysvar&lt;'info, Rent&gt; - Variable système de loyer.
- treasury_account: AccountInfo&lt;'info&gt; - Compte de la trésorerie.

**ActivateTicket**

Contexte pour activer un ticket de parc.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- nft: Account&lt;'info, Nft&gt; - Compte de NFT.
- nft_mint: AccountInfo&lt;'info&gt; - Compte de mint des NFT.
- user: Signer&lt;'info&gt; - Compte de l'utilisateur.
- token_program: Program&lt;'info, Token&gt; - Programme de token.
- park_authority: Signer&lt;'info&gt; - Compte de l'autorité du parc.

**UpdateTicketPrice**

Contexte pour la mise à jour du prix des tickets.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.

**GetNfts**

Contexte pour récupérer la liste des NFT disponibles.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.

**GenerateToken**

Contexte pour générer un token.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- user: Signer&lt;'info&gt; - Compte de l'utilisateur.

**BurnNftWithToken**

Contexte pour brûler un NFT avec un token.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- nft: Account&lt;'info, Nft&gt; - Compte de NFT.
- nft_mint: AccountInfo&lt;'info&gt; - Compte de mint des NFT.
- user_nft_account: AccountInfo&lt;'info&gt; - Compte de NFT de l'utilisateur.
- user: Signer&lt;'info&gt; - Compte de l'utilisateur.
- park_authority: Signer&lt;'info&gt; - Compte de l'autorité du parc.
- token_program: Program&lt;'info, Token&gt; - Programme de token.
- burn_history: Account&lt;'info, BurnHistory&gt; - Compte d'historique de brûlure.

**GetTicketPurchasesByUser**

Contexte pour récupérer les achats de tickets par un utilisateur.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- nft: Account&lt;'info, Nft&gt; - Compte de NFT.

**RequestWithdrawAuthorization**

Contexte pour demander une autorisation de retrait.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.

**AuthorizeWithdraw**

Contexte pour autoriser un retrait.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- treasury: Signer&lt;'info&gt; - Compte de la trésorerie.

**Withdraw**

Contexte pour effectuer un retrait.

- quest: Account&lt;'info, Quest&gt; - Compte de quête.
- admin: Signer&lt;'info&gt; - Compte de l'administrateur.
- treasury_account: AccountInfo&lt;'info&gt; - Compte de la trésorerie.

#### **Fonctions**

**initialize**

Initialise le compte de quête avec les paramètres de configuration.

pub fn initialize(

ctx: Context&lt;Initialize&gt;,

admin: Pubkey,

park_authority: Pubkey,

gem_metadata_1: String,

gem_metadata_5: String,

gem_metadata_10: String,

gem_metadata_20: String,

treasury_account: Pubkey,

) -> Result&lt;()&gt;;

**update_quiz_authority**

Met à jour l'autorité du quiz.

pub fn update_quiz_authority(ctx: Context&lt;UpdateQuizAuthority&gt;, quiz_authority: Pubkey) -> Result&lt;()&gt;;

**mint_gems**

Mint des gemmes pour un utilisateur.

pub fn mint_gems(ctx: Context&lt;MintGems&gt;, amount: u64) -> Result&lt;()&gt;;

**exchange_gems_for_nft**

Échange des gemmes contre un NFT.

pub fn exchange_gems_for_nft(ctx: Context&lt;ExchangeGemsForNft&gt;, nft_index: u64, gem_distribution: Vec&lt;u64&gt;) -> Result&lt;()&gt;;

**get_gems**

Récupère le nombre de gemmes d'un utilisateur.

pub fn get_gems(ctx: Context&lt;GetGems&gt;) -> Result&lt;GemsCount&gt;;

**get_nfts**

Récupère la liste des NFT disponibles avec leurs coûts en gemmes.

pub fn get_nfts(ctx: Context&lt;GetNfts&gt;) -> Result&lt;Vec<NftInfoWithIndex&gt;>;

**get_nft_by_index**

Récupère les informations d'un NFT de récompense par index.

pub fn get_nft_by_index(ctx: Context&lt;GetNftByIndex&gt;, index: u64) -> Result&lt;NftInfoWithIndex&gt;;

**update_nft**

Met à jour un NFT de récompense existant avec un nouveau coût et des nouvelles métadonnées.

pub fn update_nft(ctx: Context&lt;UpdateNft&gt;, nft_index: u64, gem_cost: u64, metadata_uri: String) -> Result&lt;()&gt;;

**add_nft**

Ajoute un nouveau NFT de récompense à la liste des NFT disponibles.

pub fn add_nft(ctx: Context&lt;AddNft&gt;, gem_cost: u64, metadata_uri: String) -> Result&lt;()&gt;;

**mint_park_ticket**

Crée un ticket de parc pour un utilisateur.

pub fn mint_park_ticket(ctx: Context&lt;MintParkTicket&gt;, metadata_uri: String, unique_ticket_id: u64) -> Result&lt;()&gt;;

**activate_ticket**

Active un ticket de parc pour un utilisateur.

pub fn activate_ticket(ctx: Context&lt;ActivateTicket&gt;, token: String, ticket_id: u64) -> Result&lt;()&gt;;

**update_ticket_price**

Met à jour le prix des tickets.

pub fn update_ticket_price(ctx: Context&lt;UpdateTicketPrice&gt;, ticket_price: u64) -> Result&lt;()&gt;;

**get_ticket_price**

Récupère le prix actuel des tickets.

pub fn get_ticket_price(ctx: Context&lt;GetTicketPrice&gt;) -> Result&lt;u64&gt;;

**burn_nft_with_token**

Brûle un NFT contre sa récompense dans le parc avec un token temporaire.

pub fn burn_nft_with_token(ctx: Context&lt;BurnNftWithToken&gt;, token: String) -> Result&lt;()&gt;;

**get_burned_nfts_by_user**

Récupère la liste des NFT brûlés par un utilisateur.

pub fn get_burned_nfts_by_user(ctx: Context&lt;GetBurnedNftsByUser&gt;, user_key: Pubkey) -> Result&lt;Vec<BurnedNft&gt;>;

**generate_token**

Génère un token temporaire côté user pour utiliser un ticket ou un NFT de récompense au parc : échange de QrCode au niveau du front que l’utilisateur présentera au commerçant (park_authority lance la fonction activate_ticket ou burn_nft_with_token)

pub fn generate_token(ctx: Context&lt;GenerateToken&gt;, nft_index: u64, ticket_id: u64) -> Result&lt;String&gt;;

**get_ticket_purchases_by_user**

Récupère les achats de tickets par un utilisateur.

pub fn get_ticket_purchases_by_user(ctx: Context&lt;GetTicketPurchasesByUser&gt;, user_key: Pubkey) -> Result&lt;Vec<TicketPurchase&gt;>;

**request_withdraw_authorization**

Admin demande une autorisation de retrait.

pub fn request_withdraw_authorization(ctx: Context&lt;RequestWithdrawAuthorization&gt;, amount: u64) -> Result&lt;()&gt;;

**authorize_withdraw**

Treasury autorise ou refuse une demande de retrait de admin.

pub fn authorize_withdraw(ctx: Context&lt;AuthorizeWithdraw&gt;, authorize: bool) -> Result&lt;()&gt;;

**withdraw**

Effectue un retrait.

pub fn withdraw(ctx: Context&lt;Withdraw&gt;) -> Result&lt;()&gt;;

#### **Erreurs**

**GemQuestError**

Erreurs spécifiques au programme GemQuest.

- PendingWithdrawalRequest = 6000 - Il y a déjà une demande de retrait en attente.
- MissingWithdrawalAuthorization = 6001 - L'autorisation de retrait est manquante.
