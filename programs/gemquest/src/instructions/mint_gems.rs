use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata as Metaplex,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

/// Mint des gemmes pour un utilisateur lorsqu'il réussit un quiz.
/// Les gemmes sont mintées en lots de 20, 10, 5 et 1, sous l'authorité du quiz
/// Le quiz est un autre program en cours de développement.
/// # Arguments
///
/// * `ctx` - Le contexte des comptes nécessaires pour la création des gemmes.
/// * `amount` - Le nombre de gemmes à créer.
pub fn mint_gems(ctx: Context<MintGems>, amount: u64) -> Result<()> {
    // let user_ticket = &ctx.accounts.user_ticket_account;
    // if user_ticket.owner != ctx.accounts.user.key() {
    //     return Err(ProgramError::IllegalOwner.into());
    // }

    // let quest = &ctx.accounts.quest;
    // if ctx.accounts.quiz_authority.key() != quest.quiz_authority {
    //     return Err(ProgramError::IllegalOwner.into());
    // }

    // let mut remaining = amount;
    // while remaining > 0 {
    //     let (gem_value, metadata_uri, gem_account) = if remaining >= 20 {
    //         (20, quest.gem_metadata_20.clone(), &mut ctx.accounts.gem_20)
    //     } else if remaining >= 10 {
    //         (10, quest.gem_metadata_10.clone(), &mut ctx.accounts.gem_10)
    //     } else if remaining >= 5 {
    //         (5, quest.gem_metadata_5.clone(), &mut ctx.accounts.gem_5)
    //     } else {
    //         (1, quest.gem_metadata_1.clone(), &mut ctx.accounts.gem_1)
    //     };

    //     remaining -= gem_value;

        // let cpi_accounts = MintTo {
        //     mint: ctx.accounts.gem_mint.to_account_info(),
        //     to: ctx.accounts.user_token_account.to_account_info(),
        //     // authority: ctx.accounts.park_authority.to_account_info(),
        //     authority: ctx.accounts.admin.to_account_info(),
        // };
        // let cpi_program = ctx.accounts.token_program.to_account_info();
        // let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        // token::mint_to(cpi_ctx, gem_value)?;

    //     gem_account.metadata_uri = metadata_uri;
    //     gem_account.amount += gem_value;
    //     gem_account.owner = *ctx.accounts.user.key;
    // }

    Ok(())
}

#[derive(Accounts)]
pub struct MintGems<'info> {
    // #[account(mut, seeds = [b"gems", user.key().as_ref(), b"1"], bump)]
    // pub gem_1: Account<'info, Gems>,
    // #[account(mut, seeds = [b"gems", user.key().as_ref(), b"5"], bump)]
    // pub gem_5: Account<'info, Gems>,
    // #[account(mut, seeds = [b"gems", user.key().as_ref(), b"10"], bump)]
    // pub gem_10: Account<'info, Gems>,
    // #[account(mut, seeds = [b"gems", user.key().as_ref(), b"20"], bump)]
    // pub gem_20: Account<'info, Gems>,
    // #[account(mut)]
    // /// CHECK: This is not dangerous because nous don't read ou write from this account
    // pub gem_mint: AccountInfo<'info>,
    // #[account(mut)]
    // /// CHECK: This is not dangerous because nous don't read ou write from this account
    // pub user_token_account: AccountInfo<'info>,
    // #[account(mut)]
    // pub park_authority: Signer<'info>,
    // #[account(mut)]
    // pub user: Signer<'info>,
    // pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    // pub rent: Sysvar<'info, Rent>,
    // #[account(mut)]
    // pub user_ticket_account: Account<'info, Nft>,
    // #[account(mut)]
    // pub quiz_authority: Signer<'info>,
    // #[account(mut)]
    // pub quest: Account<'info, Quest>,

    // #[account(mut)]
    // pub admin: Signer<'info>,
    // #[account(mut)]
    // pub user_account: Account<'info, UserAccount>,
}