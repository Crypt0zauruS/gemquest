use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::AssociatedToken,
        metadata::{
            create_master_edition_v3, create_metadata_accounts_v3,
            mpl_token_metadata::types::DataV2, CreateMasterEditionV3, CreateMetadataAccountsV3,
            Metadata,
        },
        token::{mint_to, burn, Burn, Mint, MintTo, Token, TokenAccount},
    },
};

pub fn burn_tokens(
    ctx: Context<BurnTokens>,
    amount: u64,
) -> Result<()> {
    // Burn tokens before creating the NFT
    let burn_cpi_accounts = Burn {
        mint: ctx.accounts.mint_token_account.to_account_info(),
        from: ctx.accounts.associated_token_account.to_account_info(),
        authority: ctx.accounts.recipient.to_account_info(),
    };
    let burn_cpi_program = ctx.accounts.token_program.to_account_info();
    let burn_cpi_ctx = CpiContext::new(burn_cpi_program, burn_cpi_accounts);
    burn(burn_cpi_ctx, amount)?;

    Ok(())
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    // Add user token account to burn from
    #[account(mut)]
    pub associated_token_account: Account<'info, TokenAccount>,

    // Add token mint account to check the token type and manage burning
    #[account(mut)]
    pub mint_token_account: Account<'info, Mint>,

    pub recipient: SystemAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}