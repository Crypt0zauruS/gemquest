use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, MintTo, InitializeMint, Token};
use anchor_spl::associated_token::AssociatedToken;

/**
* Initialize the mint for the GEMS token.
* 
* # Arguments
* 
* * `ctx` - Context of the accounts necessary for the mint initialization. 
* * `decimals` - Decimals number for the token.
* * `initial_supply` - Initial supply of GEMS.
*/
pub fn initialize_mint_token_gems(ctx: Context<TokenGemsInfo>, decimals: u8, initial_supply: u64) -> Result<()> {
    let cpi_accounts = InitializeMint {
        mint: ctx.accounts.token_gem_account.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);

    token::initialize_mint(cpi_ctx, decimals, &ctx.accounts.admin.key(), None)?;

    // Mint the initial supply to the admin's account
    // let cpi_accounts = MintTo {
    //     mint: ctx.accounts.token_gem_account.to_account_info(),
    //     to: ctx.accounts.admin_token_gems_account.to_account_info(),
    //     authority: ctx.accounts.admin.to_account_info(),
    // };
    // let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
    // token::mint_to(cpi_ctx, initial_supply)?;

    Ok(())
}

#[derive(Accounts)]
pub struct TokenGemsInfo<'info> {
    #[account(init, payer = admin, mint::decimals = 9, mint::authority = admin)]
    pub token_gem_account: Account<'info, Mint>,
    #[account(init, payer = admin, associated_token::mint = token_gem_account, associated_token::authority = admin)]
    pub admin_token_gems_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub admin: Signer<'info>,
    
    
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}