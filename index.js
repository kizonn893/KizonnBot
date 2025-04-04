const { default: WabotSocket, useMultiFileAuthState} = require ("@whiskeysockets/baileys");
const Pino = require('pino');
const useCode = process.argv.includes("--code");


(async function connect(){
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const kizon = WabotSocket({
        logger: Pino({ level: "silent"}),
        browser: ["chrome (Ubuntu)","",""],
        auth: state,
        printQRInTerminal: !useCode,
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: false,
    });
    if (useCode && !kizon.user && !kizon.authState.creds.registered) {
        async function terhubungMenggunakanCode() {
            const readline = require ("readline").createInterface({input: process.stdin,output: process.stdout
            });
            const question = (text) => new
            Promise((resolve) => {
                readline.question(text, (answer) => {
                    resolve(answer);
                    readline.close();
                });
            });
            let phoneNumber = "";
            if (!phoneNumber) {
                phoneNumber = await question("Masukkan nomor whatsapp anda bos kii contoh +6274836 : +");
            } 
               try {
                   let code = await bot.requestPairingCode(phoneNumber)
                   code = code?.match(/.{1,4}/g).join("-") || code;
                   console.log(code);
               } catch(err) {
                   console.log(err);
               
            }
        }
        await terhubungMenggunakanCode();
    }
    kizon.ev.on("connection.update", (c) => {
       const  { connection, lastDisconnect } = c;
       if (connection === "close") {
           console.log(lastDisconnect);
           connect();
       }
       if (connection === "open") {
           console.log(kizon.user.id.split(":")[0]);
       }
    });
    kizon.ev.on("creds.update", saveCreds);
    return kizon
    
})();