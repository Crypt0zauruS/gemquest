// use anchor_lang::prelude::*;
// use anchor_spl::token::{self, Burn, MintTo, Token};
// use rand::Rng;

// declare_id!("85Fem6tuph519WcFFrDJmKAJJ9cJkqn4qGnynMjK14ex");

// const TICKET_EXPIRATION_DURATION: i64 = 24 * 60 * 60; // 24 heures en secondes

// /// Le programme `gemquest` gère les gemmes et les NFT pour une quête de gemmes.
// #[program]
// pub mod gemquest {
//     use super::*;

//     /// Initialise le compte de quête avec les paramètres de configuration.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour l'initialisation.
//     /// * `admin` - L'adresse de l'administrateur.
//     /// * `park_authority` - L'adresse de l'autorité du parc.
//     /// * `gem_metadata_1` - Métadonnées pour les gemmes de valeur 1.
//     /// * `gem_metadata_5` - Métadonnées pour les gemmes de valeur 5.
//     /// * `gem_metadata_10` - Métadonnées pour les gemmes de valeur 10.
//     /// * `gem_metadata_20` - Métadonnées pour les gemmes de valeur 20.
//     /// * `treasury_account` - Compte de la trésorerie.
//     pub fn initialize(
//         ctx: Context<Initialize>,
//         admin: Pubkey,
//         park_authority: Pubkey,
//         gem_metadata_1: String,
//         gem_metadata_5: String,
//         gem_metadata_10: String,
//         gem_metadata_20: String,
//         treasury_account: Pubkey,
//     ) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
//         quest.admin = admin;
//         quest.park_authority = park_authority;
//         quest.treasury_account = treasury_account;
//         quest.quiz_authority = Pubkey::default();
//         quest.total_gems = 0;
//         quest.ticket_price = 0;

//         quest.gem_metadata_1 = gem_metadata_1;
//         quest.gem_metadata_5 = gem_metadata_5;
//         quest.gem_metadata_10 = gem_metadata_10;
//         quest.gem_metadata_20 = gem_metadata_20;
//         quest.ticket_purchases_keys = Vec::new();
//         quest.ticket_purchases_data = Vec::new();

//         quest.nfts.push(NftInfo {
//             gem_cost: 100,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQSKL.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 150,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQVIP.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 50,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGS.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 30,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFD.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 40,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFS.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 40,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGP.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 300,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQEEA.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 220,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQTS.json".to_string(),
//         });
//         quest.nfts.push(NftInfo {
//             gem_cost: 160,
//             metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGC.json".to_string(),
//         });

//         // Initialize the burn history account
//         let burn_history = &mut ctx.accounts.burn_history;
//         burn_history.burn_keys = Vec::new();
//         burn_history.burn_data = Vec::new();

//         Ok(())
//     }

//     /// Met à jour l'autorité du quiz.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour la mise à jour.
//     /// * `quiz_authority` - L'adresse de la nouvelle autorité du quiz.
//     pub fn update_quiz_authority(ctx: Context<UpdateQuizAuthority>, quiz_authority: Pubkey) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;

//         if ctx.accounts.admin.key() != quest.admin {
//             return Err(ProgramError::IllegalOwner.into());
//         }

//         quest.quiz_authority = quiz_authority;

//         Ok(())
//     }

//     /// Mint des gemmes pour un utilisateur lorsqu'il réussit un quiz.
//     /// Les gemmes sont mintées en lots de 20, 10, 5 et 1, sous l'authorité du quiz
//     /// Le quiz est un autre program en cours de développement.
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour la création des gemmes.
//     /// * `amount` - Le nombre de gemmes à créer.
//     pub fn mint_gems(ctx: Context<MintGems>, amount: u64) -> Result<()> {
//         let user_ticket = &ctx.accounts.user_ticket_account;
//         if user_ticket.owner != ctx.accounts.user.key() {
//             return Err(ProgramError::IllegalOwner.into());
//         }
    
//         let quest = &ctx.accounts.quest;
//         if ctx.accounts.quiz_authority.key() != quest.quiz_authority {
//             return Err(ProgramError::IllegalOwner.into());
//         }
    
//         let mut remaining = amount;
//         while remaining > 0 {
//             let (gem_value, metadata_uri, gem_account) = if remaining >= 20 {
//                 (20, quest.gem_metadata_20.clone(), &mut ctx.accounts.gem_20)
//             } else if remaining >= 10 {
//                 (10, quest.gem_metadata_10.clone(), &mut ctx.accounts.gem_10)
//             } else if remaining >= 5 {
//                 (5, quest.gem_metadata_5.clone(), &mut ctx.accounts.gem_5)
//             } else {
//                 (1, quest.gem_metadata_1.clone(), &mut ctx.accounts.gem_1)
//             };
    
//             remaining -= gem_value;
    
//             let cpi_accounts = MintTo {
//                 mint: ctx.accounts.gem_mint.to_account_info(),
//                 to: ctx.accounts.user_token_account.to_account_info(),
//                 authority: ctx.accounts.park_authority.to_account_info(),
//             };
//             let cpi_program = ctx.accounts.token_program.to_account_info();
//             let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
//             token::mint_to(cpi_ctx, gem_value)?;
    
//             gem_account.metadata_uri = metadata_uri;
//             gem_account.amount += gem_value;
//             gem_account.owner = *ctx.accounts.user.key;
//         }
    
//         Ok(())
//     }

//     /// Échange des gemmes contre un NFT.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour l'échange.
//     /// * `nft_index` - L'index du NFT à obtenir.
//     /// * `gem_distribution` - La distribution des gemmes à échanger.
//     pub fn exchange_gems_for_nft(ctx: Context<ExchangeGemsForNft>, nft_index: u64, gem_distribution: Vec<u64>) -> Result<()> {
//         let quest = &ctx.accounts.quest;
//         let nft_info = &quest.nfts[nft_index as usize];
    
//         let mut total_gem_balance = 0;
//         for (i, &count) in gem_distribution.iter().enumerate() {
//             total_gem_balance += count * [1, 5, 10, 20][i];
//         }
    
//         if total_gem_balance < nft_info.gem_cost {
//             return Err(ProgramError::InsufficientFunds.into());
//         }
    
//         let mut remaining_cost = nft_info.gem_cost;
//         for (i, &count) in gem_distribution.iter().enumerate().rev() {
//             let gem_value = [1, 5, 10, 20][i];
//             let burn_amount = std::cmp::min(remaining_cost / gem_value, count as u64);
    
//             if burn_amount > 0 {
//                 let burn_cpi_accounts = Burn {
//                     mint: ctx.accounts.gem_mint.to_account_info(),
//                     from: ctx.accounts.user_gem_account.to_account_info(),
//                     authority: ctx.accounts.user.to_account_info(),
//                 };
//                 let burn_cpi_program = ctx.accounts.token_program.to_account_info();
//                 let burn_cpi_ctx = CpiContext::new(burn_cpi_program, burn_cpi_accounts);
//                 token::burn(burn_cpi_ctx, burn_amount * gem_value)?;
    
//                 remaining_cost -= burn_amount * gem_value;
//             }
    
//             if remaining_cost <= 0 {
//                 break;
//             }
//         }
    
//         // Charger ou initialiser le compte NFT
//         let nft_account = &mut ctx.accounts.nft;
    
//         if nft_account.owner == Pubkey::default() {
//             let mint_cpi_accounts = MintTo {
//                 mint: ctx.accounts.nft_mint.to_account_info(),
//                 to: ctx.accounts.user_nft_account.to_account_info(),
//                 authority: ctx.accounts.park_authority.to_account_info(),
//             };
//             let mint_cpi_program = ctx.accounts.token_program.to_account_info();
//             let mint_cpi_ctx = CpiContext::new(mint_cpi_program, mint_cpi_accounts);
//             token::mint_to(mint_cpi_ctx, 1)?;
    
//             nft_account.metadata_uri = nft_info.metadata_uri.clone();
//             nft_account.owner = *ctx.accounts.user.key;
//             nft_account.quantity = 1;
//         } else {
//             nft_account.quantity += 1;
//         }
    
//         Ok(())
//     }

//     /// Récupère le nombre de gemmes d'un utilisateur.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour récupérer les gemmes.
//     pub fn get_gems(ctx: Context<GetGems>) -> Result<GemsCount> {
//         let gems_1 = ctx.accounts.gem_1.amount;
//         let gems_5 = ctx.accounts.gem_5.amount;
//         let gems_10 = ctx.accounts.gem_10.amount;
//         let gems_20 = ctx.accounts.gem_20.amount;
    
//         Ok(GemsCount {
//             gems_1,
//             gems_5,
//             gems_10,
//             gems_20,
//         })
//     }

//     /// Récupère la liste des NFT disponibles avec leurs coûts en gemmes.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour récupérer les NFT.
//     pub fn get_nfts(ctx: Context<GetNfts>) -> Result<Vec<NftInfoWithIndex>> {
//         let quest = &ctx.accounts.quest;
//         let nfts_with_index: Vec<NftInfoWithIndex> = quest.nfts.iter().enumerate().map(|(index, nft)| {
//             NftInfoWithIndex {
//                 index: index as u64,
//                 gem_cost: nft.gem_cost,
//                 metadata_uri: nft.metadata_uri.clone(),
//             }
//         }).collect();
//         Ok(nfts_with_index)
//     }

// /// Récupère les informations d'un NFT de récompense par index.
// ///
// /// # Arguments
// ///
// /// * `ctx` - Le contexte des comptes.
// /// * `index` - L'index du NFT de récompense à récupérer.
// ///
// /// # Retour
// ///
// /// Retourne les informations du NFT de récompense si l'index est valide, sinon une erreur.
// pub fn get_nft_by_index(ctx: Context<GetNftByIndex>, index: u64) -> Result<NftInfoWithIndex> {
//     let quest = &ctx.accounts.quest;

//     if let Some(nft_info) = quest.nfts.get(index as usize) {
//         Ok(NftInfoWithIndex {
//             index,
//             gem_cost: nft_info.gem_cost,
//             metadata_uri: nft_info.metadata_uri.clone(),
//         })
//     } else {
//         Err(ProgramError::InvalidArgument.into())
//     }
// }


//     /// Met à jour un NFT de récompense existant avec un nouveau coût et des nouvelles métadonnées.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour la mise à jour.
//     /// * `nft_index` - L'index du NFT à mettre à jour.
//     /// * `gem_cost` - Le nouveau coût en gemmes du NFT.
//     /// * `metadata_uri` - Les nouvelles métadonnées du NFT.
//     pub fn update_nft(ctx: Context<UpdateNft>, nft_index: u64, gem_cost: u64, metadata_uri: String) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;

//         if ctx.accounts.admin.key() != quest.admin {
//             return Err(ProgramError::IllegalOwner.into());
//         }

//         let nft_info = &mut quest.nfts[nft_index as usize];
//         nft_info.gem_cost = gem_cost;
//         nft_info.metadata_uri = metadata_uri;

//         Ok(())
//     }

//     /// Ajoute un nouveau NFT de récompense à la liste des NFT disponibles.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour l'ajout.
//     /// * `gem_cost` - Le coût en gemmes du nouveau NFT.
//     /// * `metadata_uri` - Les métadonnées du nouveau NFT.
//     pub fn add_nft(ctx: Context<AddNft>, gem_cost: u64, metadata_uri: String) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;

//         if ctx.accounts.admin.key() != quest.admin {
//             return Err(ProgramError::IllegalOwner.into());
//         }

//         let new_nft = NftInfo {
//             gem_cost,
//             metadata_uri,
//         };
//         quest.nfts.push(new_nft);

//         Ok(())
//     }

//     /// Crée un ticket de parc pour un utilisateur lorsqu'il l'achète.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour la création du ticket.
//     /// * `metadata_uri` - Les métadonnées du ticket. notamment la date d'expiration.
//     /// qui sera calculé par le front-end et intégrée dans les métadonnées.
//     /// * `unique_ticket_id` - L'identifiant unique du ticket.
//     pub fn mint_park_ticket(ctx: Context<MintParkTicket>, metadata_uri: String, unique_ticket_id: u64) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
//         let ticket_price = quest.ticket_price;
//         let user = &ctx.accounts.user;
//         let treasury = &ctx.accounts.treasury_account;
    
//         if user.lamports() < ticket_price {
//             return Err(ProgramError::InsufficientFunds.into());
//         }
    
//         **user.to_account_info().lamports.borrow_mut() -= ticket_price;
//         **treasury.to_account_info().lamports.borrow_mut() += ticket_price;
    
//         let cpi_accounts = MintTo {
//             mint: ctx.accounts.ticket_mint.to_account_info(),
//             to: ctx.accounts.user_token_account.to_account_info(),
//             authority: ctx.accounts.park_authority.to_account_info(),
//         };
//         let cpi_program = ctx.accounts.token_program.to_account_info();
//         let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
//         token::mint_to(cpi_ctx, 1)?;
    
//         let nft = &mut ctx.accounts.nft;
//         nft.metadata_uri = metadata_uri;
//         nft.owner = *ctx.accounts.user.key;
//         nft.status = NftStatus::Inactive;
//         nft.activation_timestamp = 0; // Initialisation de l'activation_timestamp
//         nft.ticket_id = unique_ticket_id; // Enregistrement du ticket_id
    
//         // Enregistrer l'achat du ticket
//         let timestamp = Clock::get()?.unix_timestamp;
//         let ticket_purchase = TicketPurchase {
//             timestamp,
//             user: *ctx.accounts.user.key,
//             ticket_id: unique_ticket_id, // Enregistrement du ticket_id
//         };
//         quest.ticket_purchases_keys.push(*ctx.accounts.user.key);
//         quest.ticket_purchases_data.push(ticket_purchase);
    
//         Ok(())
//     }
    
//     /// Active un ticket de parc pour un utilisateur, en utilisant un token 
//     /// temporaire échamgé par qrcode avec le commerçant à l'entrée du parc.
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour l'activation.
//     /// * `token` - Le token généré pour l'activation.
//     /// * `ticket_id` - L'identifiant unique du ticket.
//     ///
//     /// # Remarques
//     ///
//     /// Le front-end extrait le `ticket_id` du NFT de l'utilisateur et l'envoie avec le token.
//     pub fn activate_ticket(ctx: Context<ActivateTicket>, token: String, ticket_id: u64) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
//         let current_time = Clock::get()?.unix_timestamp;
    
//         // Nettoyer les tokens expirés
//         quest.tokens.retain(|t| t.expiration > current_time);
    
//         // Trouver le token correspondant
//         let token_index = quest.tokens.iter().position(|t| t.token == token);
    
//         if let Some(index) = token_index {
//             let token_info = &quest.tokens[index];
    
//             // Vérifier que le token est bien pour un ticket
//             if ticket_id == 0 {
//                 return Err(ProgramError::InvalidArgument.into());
//             }
    
//             // Vérifier que l'appelant est bien le `park_authority`
//             if ctx.accounts.park_authority.key() != quest.park_authority {
//                 return Err(ProgramError::IllegalOwner.into());
//             }

//             let nft = &mut ctx.accounts.nft;

//             // Vérifier si le ticket est déjà activé ou expiré
//             if nft.status == NftStatus::Active && current_time > nft.activation_timestamp + TICKET_EXPIRATION_DURATION {
//                 nft.status = NftStatus::Expired;
//             }

//             // Vérifier que le ticket appartient à l'utilisateur, est inactif, non expiré et a le bon ticket_id
            
//             if nft.owner != token_info.user || nft.status != NftStatus::Inactive || nft.status != NftStatus::Expired || nft.ticket_id != ticket_id {
//                 return Err(ProgramError::IllegalOwner.into());
//             }
    
//             // Activer le ticket
//             nft.status = NftStatus::Active;
//             nft.activation_timestamp = current_time;
    
//             // Supprimer le token utilisé
//             quest.tokens.remove(index);
    
//             Ok(())
//         } else {
//             Err(ProgramError::InvalidArgument.into())
//         }
//     }

//     /// Met à jour le prix des tickets.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour la mise à jour.
//     /// * `ticket_price` - Le nouveau prix des tickets.
//     pub fn update_ticket_price(ctx: Context<UpdateTicketPrice>, ticket_price: u64) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;

//         if ctx.accounts.admin.key() != quest.admin {
//             return Err(ProgramError::IllegalOwner.into());
//         }

//         quest.ticket_price = ticket_price;

//         Ok(())
//     }

//     /// Récupère le prix actuel des tickets.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour récupérer le prix des tickets.
//     pub fn get_ticket_price(ctx: Context<GetTicketPrice>) -> Result<u64> {
//         let quest = &ctx.accounts.quest;
//         Ok(quest.ticket_price)
//     }

//     /// Brûle un NFT contre sa récompense dans le parc avec un token temporaire
//     /// échangé par qrcode avec le commerçant
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour la brûlure.
//     /// * `token` - Le token généré pour la brûlure.
//     pub fn burn_nft_with_token(ctx: Context<BurnNftWithToken>, token: String) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
//         let current_time = Clock::get()?.unix_timestamp;
    
//         // Nettoyer les tokens expirés
//         quest.tokens.retain(|t| t.expiration > current_time);
    
//         // Trouver le token correspondant
//         let token_index = quest.tokens.iter().position(|t| t.token == token);
    
//         if let Some(index) = token_index {
//             let token_info = &quest.tokens[index];
    
//             // Vérifier que l'utilisateur possède bien le NFT de l'index à brûler
//             let nft = &mut ctx.accounts.nft;
//             if nft.owner != token_info.user || nft.quantity == 0 {
//                 return Err(ProgramError::IllegalOwner.into());
//             }
    
//             // Réduire la quantité du NFT
//             nft.quantity -= 1;
    
//             // Brûler le NFT
//             let burn_cpi_accounts = Burn {
//                 mint: ctx.accounts.nft_mint.to_account_info(),
//                 from: ctx.accounts.user_nft_account.to_account_info(),
//                 authority: ctx.accounts.park_authority.to_account_info(),
//             };
//             let burn_cpi_program = ctx.accounts.token_program.to_account_info();
//             let burn_cpi_ctx = CpiContext::new(burn_cpi_program, burn_cpi_accounts);
//             token::burn(burn_cpi_ctx, 1)?;
    
//             let burned_nft = BurnedNft {
//                 index: token_info.nft_index,
//                 user: token_info.user,
//                 timestamp: Clock::get()?.unix_timestamp,
//             };
    
//             let burn_history = &mut ctx.accounts.burn_history;
//             burn_history.burn_keys.push(token_info.user);
//             burn_history.burn_data.push(burned_nft);
    
//             // Supprimer le token utilisé
//             quest.tokens.remove(index);
    
//             Ok(())
//         } else {
//             Err(ProgramError::InvalidArgument.into())
//         }
//     }

//     /// Récupère la liste des NFT brûlés par un utilisateur.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour récupérer les NFT brûlés.
//     /// * `user_key` - L'adresse de l'utilisateur.
//     pub fn get_burned_nfts_by_user(ctx: Context<GetBurnedNftsByUser>, user_key: Pubkey) -> Result<Vec<BurnedNft>> {
//         let burn_history = &ctx.accounts.burn_history;
//         let user_burned_nfts: Vec<BurnedNft> = burn_history
//             .burn_keys
//             .iter()
//             .enumerate()
//             .filter(|&(_, &key)| key == user_key)
//             .map(|(index, _)| burn_history.burn_data[index].clone())
//             .collect();
//         Ok(user_burned_nfts)
//     }

//     /// Génère un token pour utiliser un ticket ou un NFT de récompense au parc.
//     /// Le front-end l'utilisera sous forme de QR code pour l'échanger avec le commerçant.
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour générer le token.
//     /// * `nft_index` - L'index du NFT à utiliser.
//     /// * `ticket_id` - L'identifiant unique du ticket à utiliser.
//     ///
//     /// # Remarques
//     ///
//     /// - Pour générer un token pour utiliser un ticket à partir du front:
//     /// ```rust
//     /// let token = generate_token(ctx, 0, ticket_id)?;
//     /// ```
//     /// - Pour générer un token pour utiliser un NFT:
//     /// ```rust
//     /// let token = generate_token(ctx, nft_index, 0)?;
//     /// ```
//     pub fn generate_token(ctx: Context<GenerateToken>, nft_index: u64, ticket_id: u64) -> Result<String> {
//         let user_key = ctx.accounts.user.key();
//         let quest = &mut ctx.accounts.quest;
    
//         // Génération du token aléatoire
//         let mut rng = rand::thread_rng();
//         let token: String = (0..16).map(|_| rng.sample(rand::distributions::Alphanumeric) as char).collect();
    
//         // Déterminer l'index approprié basé sur le type de token
//         let token_info = TokenInfo {
//             token: token.clone(),
//             user: user_key,
//             nft_index: if ticket_id == 0 { nft_index } else  { ticket_id } ,
//             expiration: Clock::get()?.unix_timestamp + 60, // Valide pour 1 minute
//         };
    
//         quest.tokens.push(token_info);
    
//         Ok(token)
//     }

//     /// Récupère les achats de tickets par un utilisateur.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour récupérer les achats de tickets.
//     /// * `user_key` - L'adresse de l'utilisateur.
//     pub fn get_ticket_purchases_by_user(ctx: Context<GetTicketPurchasesByUser>, user_key: Pubkey) -> Result<Vec<TicketPurchase>> {
//         let quest = &mut ctx.accounts.quest;
//         let current_time = Clock::get()?.unix_timestamp;
    
//         // Mettre à jour le statut des tickets à "expiré" si leur durée d'activation a été dépassée
//         for ticket in &mut quest.ticket_purchases_data {
//             if ticket.user == user_key {
//                 // Vérifiez si le ticket est déjà activé ou expiré
//                 if ctx.accounts.nft.status == NftStatus::Active && current_time > ctx.accounts.nft.activation_timestamp + TICKET_EXPIRATION_DURATION {
//                     ctx.accounts.nft.status = NftStatus::Expired;
//                 }
//             }
//         }
    
//         let user_purchases: Vec<TicketPurchase> = quest
//             .ticket_purchases_keys
//             .iter()
//             .enumerate()
//             .filter(|&(_, &key)| key == user_key)
//             .map(|(index, _)| quest.ticket_purchases_data[index].clone())
//             .collect();
//         Ok(user_purchases)
//     }

//     /// Demande une autorisation de retrait.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour demander l'autorisation.
//     /// * `amount` - Le montant à retirer.
//     pub fn request_withdraw_authorization(ctx: Context<RequestWithdrawAuthorization>, amount: u64) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
    
//         if ctx.accounts.admin.key() != quest.admin {
//             return Err(ProgramError::IllegalOwner.into());
//         }
    
//         // Vérifier s'il y a déjà une demande en attente
//         if quest.withdraw_requests.iter().any(|req| !req.responded) {
//             return Err(GemQuestError::PendingWithdrawalRequest.into());
//         }
    
//         quest.withdraw_authorized = false; // Initialiser l'autorisation de retrait à false
    
//         // Enregistrer la demande de retrait
//         let timestamp = Clock::get()?.unix_timestamp;
//         let withdraw_request = WithdrawRequest {
//             timestamp,
//             admin: *ctx.accounts.admin.key,
//             amount,
//             responded: false,
//         };
//         quest.withdraw_requests.push(withdraw_request);
    
//         Ok(())
//     }

//     /// Autorise ou refuse une demande de retrait.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour autoriser ou refuser la demande.
//     /// * `authorize` - Booléen indiquant s'il faut autoriser le retrait.
//     pub fn authorize_withdraw(ctx: Context<AuthorizeWithdraw>, authorize: bool) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
    
//         if ctx.accounts.treasury.key() != quest.treasury_account {
//             return Err(ProgramError::IllegalOwner.into());
//         }
    
//         quest.withdraw_authorized = authorize;
    
//         // Enregistrer l'autorisation de retrait
//         let timestamp = Clock::get()?.unix_timestamp;
//         let withdraw_authorization = WithdrawAuthorization {
//             timestamp,
//             treasury: *ctx.accounts.treasury.key,
//             authorized: authorize,
//         };
//         quest.withdraw_authorizations.push(withdraw_authorization);
    
//         // Mettre à jour la demande de retrait en attente
//         if let Some(request) = quest.withdraw_requests.iter_mut().find(|req| !req.responded) {
//             request.responded = true;
//         }
    
//         Ok(())
//     }

//     /// Effectue un retrait.
//     ///
//     /// # Arguments
//     ///
//     /// * `ctx` - Le contexte des comptes nécessaires pour le retrait.
//     pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
//         let quest = &mut ctx.accounts.quest;
//         let admin = &ctx.accounts.admin;
//         let treasury_account = &mut ctx.accounts.treasury_account;
    
//         if ctx.accounts.admin.key() != quest.admin {
//             return Err(ProgramError::IllegalOwner.into());
//         }
    
//         if !quest.withdraw_authorized {
//             return Err(GemQuestError::MissingWithdrawalAuthorization.into());
//         }
    
//         // Effectuer le retrait
//         let amount = quest.withdraw_requests.iter().find(|req| !req.responded).unwrap().amount;
//         **treasury_account.to_account_info().lamports.borrow_mut() -= amount;
//         **admin.to_account_info().lamports.borrow_mut() += amount;
    
//         // Réinitialiser l'autorisation de retrait
//         quest.withdraw_authorized = false;
    
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize<'info> {
//     #[account(
//         init,
//         payer = admin,
//         space = 
//             8 +      // Discriminator
//             (10 * 72) +  // Vecteur de NftInfo (10 NFTs, chaque NftInfo = 72 bytes)
//             (4 * 32) +   // 4 Pubkey (32 bytes chacun)
//             (4 * 256) +  // 4 String (estimation, chaque chaîne = 256 bytes)
//             8 +      // total_gems
//             8 +      // ticket_price
//             8,       // Overhead du vecteur burned_nfts (estimation)
//         seeds = [b"quest", admin.key().as_ref()],
//         bump
//     )]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
//     pub system_program: Program<'info, System>,
//     pub rent: Sysvar<'info, Rent>,
//     #[account(
//         init,
//         payer = admin,
//         space = 
//             8 +      // Discriminator
//             (10 * 56),  // Vecteur de BurnedNft (estimation de 10 entrées initiales, chaque BurnedNft = 56 bytes)
//         seeds = [b"burn_history", admin.key().as_ref()],
//         bump
//     )]
//     pub burn_history: Account<'info, BurnHistory>,
// }

// #[derive(Accounts)]
// pub struct UpdateQuizAuthority<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct GetTicketPrice<'info> {
//     pub quest: Account<'info, Quest>,
// }

// #[derive(Accounts)]
// pub struct MintGems<'info> {
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"1"], bump)]
//     pub gem_1: Account<'info, Gems>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"5"], bump)]
//     pub gem_5: Account<'info, Gems>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"10"], bump)]
//     pub gem_10: Account<'info, Gems>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"20"], bump)]
//     pub gem_20: Account<'info, Gems>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub gem_mint: AccountInfo<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub user_token_account: AccountInfo<'info>,
//     #[account(mut)]
//     pub park_authority: Signer<'info>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub token_program: Program<'info, Token>,
//     pub system_program: Program<'info, System>,
//     pub rent: Sysvar<'info, Rent>,
//     #[account(mut)]
//     pub user_ticket_account: Account<'info, Nft>,
//     #[account(mut)]
//     pub quiz_authority: Signer<'info>,
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
// }

// #[derive(Accounts)]
// #[instruction(nft_index: u64)]
// pub struct ExchangeGemsForNft<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(
//         init,
//         payer = user,
//         space = 
//             8 +      // Discriminator
//             256 +     // metadata_uri (estimation)
//             32 +      // owner (Pubkey)
//             8,        // quantity
//         seeds = [b"nft", user.key().as_ref(), &nft_index.to_le_bytes()],
//         bump
//     )]
//     pub nft: Account<'info, Nft>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because we don't read or write from this account
//     pub gem_mint: AccountInfo<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub user_gem_account: AccountInfo<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub nft_mint: AccountInfo<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub user_nft_account: AccountInfo<'info>,
//     #[account(mut)]
//     pub park_authority: Signer<'info>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
//     pub token_program: Program<'info, Token>,
//     pub rent: Sysvar<'info, Rent>,
// }

// #[derive(Accounts)]
// pub struct UpdateNft<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct GetBurnedNftsByUser<'info> {
//     #[account(mut)]
//     pub burn_history: Account<'info, BurnHistory>,
// }

// #[derive(Accounts)]
// pub struct AddNft<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct GetNftByIndex<'info> {
//     pub quest: Account<'info, Quest>,
// }


// #[derive(Accounts)]
// #[instruction(unique_ticket_id: u64)]
// pub struct MintParkTicket<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(
//         init, 
//         payer = user, 
//         space = 
//             8 +      // Discriminator
//             256 +     // metadata_uri
//             32 +      // owner
//             8 +       // status
//             8 +       // activation_timestamp
//             8,        // ticket_id
//         seeds = [b"park_ticket", user.key().as_ref(), &unique_ticket_id.to_le_bytes()],
//         bump
//     )]
//     pub nft: Account<'info, Nft>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub ticket_mint: AccountInfo<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub user_token_account: AccountInfo<'info>,
//     #[account(mut)]
//     pub park_authority: Signer<'info>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub token_program: Program<'info, Token>,
//     pub system_program: Program<'info, System>,
//     pub rent: Sysvar<'info, Rent>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub treasury_account: AccountInfo<'info>,
// }

// #[derive(Accounts)]
// pub struct ActivateTicket<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub nft: Account<'info, Nft>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub nft_mint: AccountInfo<'info>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub token_program: Program<'info, Token>,
//     #[account(mut)]
//     pub park_authority: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct UpdateTicketPrice<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct GetNfts<'info> {
//     pub quest: Account<'info, Quest>,
// }

// #[derive(Accounts)]
// pub struct GenerateToken<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub user: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct BurnNftWithToken<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub nft: Account<'info, Nft>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub nft_mint: AccountInfo<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub user_nft_account: AccountInfo<'info>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     #[account(mut)]
//     pub park_authority: Signer<'info>,
//     pub token_program: Program<'info, Token>,
//     #[account(mut)]
//     pub burn_history: Account<'info, BurnHistory>,
// }

// #[derive(Accounts)]
// pub struct GetTicketPurchasesByUser<'info> {
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub nft: Account<'info, Nft>, 
// }


// #[derive(Accounts)]
// pub struct RequestWithdrawAuthorization<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct AuthorizeWithdraw<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub treasury: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct Withdraw<'info> {
//     #[account(mut)]
//     pub quest: Account<'info, Quest>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
//     #[account(mut)]
//     /// CHECK: This is not dangerous because nous don't read ou write from this account
//     pub treasury_account: AccountInfo<'info>,
// }

// #[account]
// #[derive(Default)]
// pub struct Quest {
//     pub admin: Pubkey,
//     pub nfts: Vec<NftInfo>,
//     pub ticket_mint: Pubkey,
//     pub gem_mint: Pubkey,
//     pub nft_mint: Pubkey,
//     pub total_gems: u64,
//     pub ticket_price: u64,
//     pub quiz_authority: Pubkey,
//     pub gem_metadata_1: String,
//     pub gem_metadata_5: String,
//     pub gem_metadata_10: String,
//     pub gem_metadata_20: String,
//     pub burned_nfts: Vec<BurnedNft>,
//     pub tokens: Vec<TokenInfo>,
//     pub park_authority: Pubkey,
//     pub treasury_account: Pubkey,
//     pub ticket_purchases_keys: Vec<Pubkey>,
//     pub ticket_purchases_data: Vec<TicketPurchase>,
//     pub withdraw_authorized: bool,
//     pub withdraw_requests: Vec<WithdrawRequest>,
//     pub withdraw_authorizations: Vec<WithdrawAuthorization>,
// }

// #[account]
// #[derive(Default)]
// pub struct Gems {
//     pub metadata_uri: String,
//     pub amount: u64,
//     pub owner: Pubkey,
//     pub value: u64,
// }

// #[derive(AnchorSerialize, AnchorDeserialize)]
// pub struct GemsCount {
//     pub gems_1: u64,
//     pub gems_5: u64,
//     pub gems_10: u64,
//     pub gems_20: u64,
// }

// #[derive(Accounts)]
// pub struct GetGems<'info> {
//     pub user: Signer<'info>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"1"], bump)]
//     pub gem_1: Account<'info, Gems>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"5"], bump)]
//     pub gem_5: Account<'info, Gems>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"10"], bump)]
//     pub gem_10: Account<'info, Gems>,
//     #[account(mut, seeds = [b"gems", user.key().as_ref(), b"20"], bump)]
//     pub gem_20: Account<'info, Gems>,
// }

// #[account]
// #[derive(Default)]
// pub struct Nft {
//     pub metadata_uri: String,
//     pub owner: Pubkey,
//     pub quantity: u64,
//     pub status: NftStatus,
//     pub activation_timestamp: i64,
//     pub ticket_id: u64, // Identifiant unique pour chaque ticket
// }

// #[account]
// #[derive(Default)]
// pub struct BurnHistory {
//     pub burn_keys: Vec<Pubkey>,
//     pub burn_data: Vec<BurnedNft>,
// }

// #[derive(AnchorSerialize, AnchorDeserialize)]
// pub struct NftInfoWithIndex {
//     pub index: u64,
//     pub gem_cost: u64,
//     pub metadata_uri: String,
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct NftInfo {
//     pub gem_cost: u64,
//     pub metadata_uri: String,
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct TicketPurchase {
//     pub timestamp: i64,
//     pub user: Pubkey,
//     pub ticket_id: u64, // Identifiant unique pour chaque ticket
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct TokenInfo {
//     pub token: String,
//     pub user: Pubkey,
//     pub nft_index: u64,
//     pub expiration: i64,
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct BurnedNft {
//     pub index: u64,
//     pub user: Pubkey,
//     pub timestamp: i64,
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct WithdrawRequest {
//     pub timestamp: i64,
//     pub admin: Pubkey,
//     pub amount: u64,
//     pub responded: bool,
// }

// #[derive(Clone, AnchorSerialize, AnchorDeserialize)]
// pub struct WithdrawAuthorization {
//     pub timestamp: i64,
//     pub treasury: Pubkey,
//     pub authorized: bool,
// }

// #[error_code]
// pub enum GemQuestError {
//     #[msg("There is already a pending withdrawal request.")]
//     PendingWithdrawalRequest = 6000,
//     #[msg("Withdrawal authorization is missing.")]
//     MissingWithdrawalAuthorization = 6001,
// }

// #[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
// pub enum NftStatus {
//     Inactive,
//     Active,
//     Expired,
// }

// impl Default for NftStatus {
//     fn default() -> Self {
//         NftStatus::Inactive
//     }
// }
