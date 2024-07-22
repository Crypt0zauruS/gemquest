# Back-End de GemQuest

## Présentation

Le back-end de GemQuest repose sur du programme développé avec le framework Anchor sur la blockchain Solana. Ce programme gère toutes les interactions blockchain, incluant l'authentification, la création de tokens et de NFTs, et les transactions associées.

## Technologies Utilisées

- **Solana Blockchain** : Fournit une plateforme rapide et à faible coût pour les transactions décentralisées.
- **Anchor Framework** : Offre des outils et abstractions pour faciliter le développement et l'audit de programme sécurisés et efficaces.

## Structure du Programme

Le programme GemQuest intègre plusieurs contrats pour la gestion des tokens, des NFTs, et des interactions utilisateur. Voici les principales classes et leurs méthodes :

### Diagramme de Classe

```mermaid
classDiagram
    Gemquest -- Approve_token : 
    Gemquest -- Create_Token
    Gemquest -- Create_NFT
    Gemquest -- Initialize_Program
    Gemquest -- initialize_user_account
    Gemquest -- mint_tokens_to_user
    Gemquest: program_ID
    Gemquest: +initialize_program()
    Gemquest: +initialize_user_account()
    Gemquest: +create_token()
    Gemquest: +mint_tokens_to_user()
    Gemquest: +create_nft()
    Gemquest: +approve_token()

    class Approve_token{
        Account associated_token_account
        Account delegate
        Signer authority
        Program token_program
        +approve_token()
    }

    class Create_Token{
        Signer payer
        Account mint_account
        UncheckedAccount metadata_account
        Program token_program
        Program token_metadata_program
        Program system_program
        Sysvar rent
        +create_token()
    }

    class Create_NFT{
        Signer payer
        Account associated_token_account
        Account mint_token_account
        Account mint_nft_token_account
        UncheckedAccount metadata_account
        UncheckedAccount edition_account
        UncheckedAccount user
        Program token_program
        Program token_metadata_program
        Program associated_token_program
        Program system_program
        Sysvar rent
        -create_nft()
    }

    class Initialize_Program{
        Signer payer
        Account program_admin
        Program system_program
        +initialize_program()
    }

    class initialize_user_account{
        Account user_account
        Signer admin
        UncheckedAccount user
        Program system_program
        Sysvar rent
        +initialize_user_account()
    }
    
    class mint_tokens_to_user{
        Signer mint_authority
        SystemAccount recipient
        Account mint_account
        Account associated_token_account
        Program token_program
        Program associated_token_program
        Program system_program
        +mint_tokens_to_user()
    }
```

## Déploiement et Maintenance

Le déploiement des programmes se fait via des commandes CLI fournies par Anchor, garantissant que les contrats sont correctement compilés et déployés sur le réseau Solana. La maintenance et les mises à jour du programme peuvent être gérées de manière centralisée, en assurant une compatibilité et sécurité continues.


