const express = require('express')
const Engine = require('node-uci').Engine

var path = require('path');



async function test_engine() {
    const p = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');
    const engine = new Engine(p)
    await engine.init()
    await engine.setoption('MultiPV', '4')
    await engine.isready()
    await engine.position('r1bqkb1r/5ppp/p2ppn2/1pn5/3NP3/1BN5/PPP2PPP/R1BQR1K1 w kq - 4 10')
    // console.log('engine ready', engine.id, engine.options)
    console.time()
    // const result = await engine.go({ depth: 20 })
    // console.log(result.info)
    console.log(engine.options)
    console.timeEnd()
    await engine.quit()
}


function test_engine_promises() {
    const p = path.join(__dirname, '..', 'stockfish_13_win_x64_avx2.exe');
    const engine = new Engine(p)
    engine
        .chain()
        .init()
        .setoption('MultiPV', 3)
        .position('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3')
        .go({ depth: 15 })
        .then(result => {
            console.log(result)
        })
}
test_engine();
// server.listen(process.env.PORT || 5000, () => {
//     console.log(`Server started on port ${server.address().port} :)`);
// });