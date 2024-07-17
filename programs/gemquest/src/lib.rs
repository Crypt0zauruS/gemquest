use anchor_lang::prelude::*;

declare_id!("FUbj5uMxmJSnaCtWJymcdEYB5PpVh2nwwng1xRgXeoXm");

pub mod instructions;

use instructions::*;

#[program]
pub mod gemquest {
    use super::*;

    pub fn initialize_user_account(ctx: Context<InitializeUserAccount>) -> Result<()> {
        instructions::initialize_user_account::initialize_user_account(ctx)
    }
}

