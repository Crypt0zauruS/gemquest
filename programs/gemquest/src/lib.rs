
use {
    anchor_lang::prelude::*,
    anchor_spl::{
        metadata::{
            create_metadata_accounts_v3, mpl_token_metadata::types::DataV2,
            CreateMetadataAccountsV3, Metadata,
        },
        token::{Mint, Token},
    },
};
declare_id!("E5n2KkgFYwrBKhpiKG5xeVsLPUxwFQk4PMzUDrwYWnEg");

pub mod instructions;

use instructions::*;

#[program]
pub mod gemquest {
    use super::*;

    pub fn initialize_user_account(ctx: Context<InitializeUserAccount>) -> Result<()> {
        instructions::initialize_user_account::initialize_user_account(ctx)
    }

    pub fn create_token(
        ctx: Context<CreateToken>,
        token_name: String,
        token_symbol: String,
        token_uri: String,
    ) -> Result<()> {
         instructions::create_token::create_token(ctx, token_name, token_symbol, token_uri)
    }

    pub fn mint_tokens_to_user(ctx: Context<MintTokensToUser>, amount: u64) -> Result<()> {
        instructions::mint_tokens_to_user::mint_tokens_to_user(ctx, amount)
    }

    pub fn create_nft(
        ctx: Context<CreateNFT>,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
        nft_price: u64,
    ) -> Result<()> {
        instructions::create_nft::create_nft(ctx, nft_name, nft_symbol, nft_uri, nft_price)
    }
}