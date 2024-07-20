use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::AssociatedToken,
        token::{mint_to, Mint, MintTo, Token, TokenAccount},
    },
};

pub fn mint_tokens_to_user(ctx: Context<MintTokensToUser>, amount: u64) -> Result<()> {
    msg!("Minting tokens to associated token account...");
    msg!("Mint: {}", &ctx.accounts.mint_account.key());
    msg!("Token Address: {}", &ctx.accounts.associated_token_account.key());

    // Verify the owner of the associated token account
    let associated_token_account_info = &ctx.accounts.associated_token_account.to_account_info();
    let expected_owner = ctx.accounts.recipient.key();
    let actual_owner = associated_token_account_info.owner;
    msg!("Expected Owner: {}", expected_owner);
    msg!("Actual Owner: {}", actual_owner);

    if expected_owner != *actual_owner {
        msg!("Error: The owner of the associated token account is not the recipient.");
        return Err(ProgramError::Custom(2015).into()); // ConstraintTokenOwner
    }

    // Invoke the mint_to instruction on the token program
    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint_account.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        ),
        amount * 10u64.pow(ctx.accounts.mint_account.decimals as u32), // Mint tokens, adjust for decimals
    )?;

    msg!("Token minted successfully.");

    Ok(())
}

#[derive(Accounts)]
pub struct MintTokensToUser<'info> {
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    #[account(mut)]
    pub recipient: Signer<'info>, // The recipient must be a signer
    #[account(mut)]
    pub mint_account: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = mint_authority,
        associated_token::mint = mint_account,
        associated_token::authority = recipient,
    )]
    pub associated_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
