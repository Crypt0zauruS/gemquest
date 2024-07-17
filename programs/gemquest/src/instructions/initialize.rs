use anchor_lang::prelude::*;

pub fn initialize(
    ctx: Context<Initialize>,
    // admin: Pubkey,
    // park_authority: Pubkey,
    // gem_metadata_1: String,
    // gem_metadata_5: String,
    // gem_metadata_10: String,
    // gem_metadata_20: String,
    // treasury_account: Pubkey,
) -> Result<()> {
    // let quest = &mut ctx.accounts.quest;
    // quest.admin = admin;
    // quest.park_authority = park_authority;
    // quest.treasury_account = treasury_account;
    // quest.quiz_authority = Pubkey::default();
    // quest.total_gems = 0;
    // quest.ticket_price = 0;

    // quest.gem_metadata_1 = gem_metadata_1;
    // quest.gem_metadata_5 = gem_metadata_5;
    // quest.gem_metadata_10 = gem_metadata_10;
    // quest.gem_metadata_20 = gem_metadata_20;
    // quest.ticket_purchases_keys = Vec::new();
    // quest.ticket_purchases_data = Vec::new();

    // quest.nfts.push(NftInfo {
    //     gem_cost: 100,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQSKL.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 150,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQVIP.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 50,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGS.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 30,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFD.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 40,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQFS.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 40,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGP.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 300,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQEEA.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 220,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQTS.json".to_string(),
    // });
    // quest.nfts.push(NftInfo {
    //     gem_cost: 160,
    //     metadata_uri: "ipfs://QmQd5AC6BMf7RLZQubVZ7kqkFLeffPWwhsERLVj2wXMbEX/GQGC.json".to_string(),
    // });

    // // Initialize the burn history account
    // let burn_history = &mut ctx.accounts.burn_history;
    // burn_history.burn_keys = Vec::new();
    // burn_history.burn_data = Vec::new();

    Ok(())
}


#[derive(Accounts)]
pub struct Initialize<'info> {
// #[account(
//     init,
//     payer = admin,
//     space = 
//         8 +      // Discriminator
//         (10 * 72) +  // Vecteur de NftInfo (10 NFTs, chaque NftInfo = 72 bytes)
//         (4 * 32) +   // 4 Pubkey (32 bytes chacun)
//         (4 * 256) +  // 4 String (estimation, chaque chaîne = 256 bytes)
//         8 +      // total_gems
//         8 +      // ticket_price
//         8,       // Overhead du vecteur burned_nfts (estimation)
//     seeds = [b"quest", admin.key().as_ref()],
//     bump
// )]
// pub quest: Account<'info, Quest>,
#[account(mut)]
pub admin: Signer<'info>,
pub system_program: Program<'info, System>,
// pub rent: Sysvar<'info, Rent>,
// #[account(
//     init,
//     payer = admin,
//     space = 
//         8 +      // Discriminator
//         (10 * 56),  // Vecteur de BurnedNft (estimation de 10 entrées initiales, chaque BurnedNft = 56 bytes)
//     seeds = [b"burn_history", admin.key().as_ref()],
//     bump
// )]
// pub burn_history: Account<'info, BurnHistory>,

#[account(init, payer = admin, space = 8 + 8)]
pub user_account: Account<'info, UserAccount>,
}

#[account]
pub struct UserAccount {
    pub gem_balance: u64,
}