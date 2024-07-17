// // use anchor_lang::prelude::*;
// // use anchor_spl::token::{self, Burn, MintTo, Token};

// // declare_id!("FUbj5uMxmJSnaCtWJymcdEYB5PpVh2nwwng1xRgXeoXm");

// // pub mod instructions;

// // use instructions::*;

// // const TICKET_EXPIRATION_DURATION: i64 = 24 * 60 * 60; // 24 heures en secondes

// // /// Le programme `gemquest` gère les gemmes et les NFT pour une quête de gemmes.
// // #[program]
// // pub mod gemquest {
// //     use super::*;

// //     pub fn initialize(
// //         ctx: Context<Initialize>,
// //         // admin: Pubkey,
// //         // park_authority: Pubkey,
// //         // gem_metadata_1: String,
// //         // gem_metadata_5: String,
// //         // gem_metadata_10: String,
// //         // gem_metadata_20: String,
// //         // treasury_account: Pubkey,
// //     ) -> Result<()> {
// //        instructions::initialize::initialize(ctx)
// //     }

// //     pub fn mint_gems(ctx: Context<MintGems>, amount: u64) -> Result<()> {
// //         instructions::mint_gems::mint_gems(ctx, amount)
// //     }

// //     pub fn initialize_mint_token_gems(ctx: Context<TokenGemsInfo>, decimals: u8, initial_supply: u64) -> Result<()> {
// //         instructions::initialize_mint_token_gems::initialize_mint_token_gems(ctx, decimals, initial_supply)
// //     }
// // }
// use anchor_lang::prelude::*;

// declare_id!("FUbj5uMxmJSnaCtWJymcdEYB5PpVh2nwwng1xRgXeoXm");

// #[program]
// pub mod gemquest {
//     use super::*;

//     pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
//         // Vérifier si le compte utilisateur existe déjà
//         if ctx.accounts.user_account.to_account_info().data_len() > 0 {
//             return Err(ErrorCode::UserAlreadyExists.into());
//         }

//         let user_account = &mut ctx.accounts.user_account;
//         user_account.owner = *ctx.accounts.user.key;
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct CreateUser<'info> {
//     #[account(init_if_needed, payer = admin, space = 8 + 32, seeds = [user.key.as_ref()], bump)]
//     pub user_account: Account<'info, UserAccount>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     #[account(mut)]
//     pub admin: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[account]
// pub struct UserAccount {
//     pub owner: Pubkey,
// }

// #[error_code]
// pub enum ErrorCode {
//     #[msg("User already exists.")]
//     UserAlreadyExists,
// }
