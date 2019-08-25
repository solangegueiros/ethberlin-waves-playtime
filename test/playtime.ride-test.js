const wvs = 10 ** 8;

describe('playtime test', async function () {

    this.timeout(100000);

    before(async function () {
        await setupAccounts(
            {
                player1: 15 * wvs,
                player2: 15 * wvs,
                wallet: 0.05 * wvs});
        const script = compile(file('playtime.ride'));
        const ssTx = setScript({script}, accounts.wallet);
        await broadcast(ssTx);
        await waitForTx(ssTx.id)
        console.log('Script has been set, transaction ' + ssTx.id)
    });

    
    it('initPlayTime for player1', async function () {
        const tx = invokeScript({
            dApp: address(accounts.wallet),
            call:{
                function:"initPlayTime"
            },
            payment: null
        }, accounts.player1); 
    
        await broadcast(tx)
        await waitForTx(tx.id)
        //console.log('initPlayTime for player1, tx: ' + tx.id);
    })  

    
    it('registerPlayer2', async function(){
        const tx = invokeScript({
            dApp: address(accounts.wallet),
            call:{
                function:"registerPlayer2",
                args:[{"type": "string", "value": address(accounts.player1)}]
            },
            payment: null
        }, accounts.player2); 
    
        await broadcast(tx)
        await waitForTx(tx.id)
        //console.log('registerPlayer2, tx: ' + tx.id);
    })

    it('Player1 play 5 waves', async function(){
        const tx = invokeScript({
            dApp: address(accounts.wallet),
            call:{
                function:"play",
                args:[{"type": "string", "value": address(accounts.player1)}]
            },
            payment: [{assetId: null, amount: 5 * wvs}]
        }, accounts.player1); 
    
        await broadcast(tx)
        await waitForTx(tx.id)  
    })

        
    it('Check variables', async function(){
        result = await accountDataByKey(address(accounts.player1) + "_player2", address(accounts.wallet))
        console.log('_player2: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_player1Played", address(accounts.wallet))
        console.log('_player1Played: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_player2Played", address(accounts.wallet))
        console.log('_player2Played: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_player1Deposit", address(accounts.wallet))
        console.log('_player1Deposit: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_player2Deposit", address(accounts.wallet))
        console.log('_player2Deposit: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_gameFinished", address(accounts.wallet))
        console.log('_gameFinished: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_theWinner", address(accounts.wallet))
        console.log('_theWinner: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_gains", address(accounts.wallet))
        console.log('_gains: ' + result.value)
    })

    it('Player2 play 2 waves', async function(){
        const tx = invokeScript({
            dApp: address(accounts.wallet),
            call:{
                function:"play",
                args:[{"type": "string", "value": address(accounts.player1)}]
            },
            payment: [{assetId: null, amount: 2 * wvs}]
        }, accounts.player2); 
    
        await broadcast(tx)
        await waitForTx(tx.id)  
    })

    it('Check if player1 gain', async function(){
        result = await accountDataByKey(address(accounts.player1) + "_gameFinished", address(accounts.wallet))
        console.log('result: ' + result.value)

        result = await accountDataByKey(address(accounts.player1) + "_theWinner", address(accounts.wallet))
        console.log('result: ' + result.value)

        expect(result.value).to.equal(address(accounts.player1))
    })

})