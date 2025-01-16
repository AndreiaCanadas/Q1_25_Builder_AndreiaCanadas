import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js"

import wallet from "./dev-wallet.json"

// Import our dev wallet keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our Turbin3 public key
// Address from application: 87eaezi5Nou5d5MFH2DStENzWZ6iHNroDHZSbSca4RDu
const to = new PublicKey("87eaezi5Nou5d5MFH2DStENzWZ6iHNroDHZSbSca4RDu");

//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL/100,
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();