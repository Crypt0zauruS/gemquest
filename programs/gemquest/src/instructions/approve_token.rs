use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::AssociatedToken,
        metadata::{
            create_master_edition_v3, create_metadata_accounts_v3,
            mpl_token_metadata::types::DataV2, CreateMasterEditionV3, CreateMetadataAccountsV3,
            Metadata,
        },
        token::{approve, Approve, Token},
    },
};

pub fn approve_token(ctx: Context<ApproveToken>, amount: u64) -> Result<()> {

    let cpi_accounts = Approve {
        to: ctx.accounts.associated_token_account.to_account_info(),
        delegate: ctx.accounts.delegate.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    // Create the CpiContext we need for the request
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    // Execute anchor's helper function to approve tokens
    approve(cpi_ctx, amount)?;
    Ok(())
} 


#[derive(Accounts)]
pub struct ApproveToken<'info> {
    ///CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub associated_token_account: AccountInfo<'info>,
    ///CHECK: This is not dangerous because we don't read or write from this account
    pub delegate: AccountInfo<'info>,
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}