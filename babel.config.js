module.exports = {
    presets: [
        [
            '@babel/preset-env', 
            {
                debug: true,
                targets: { "edge": "17" , "node": "current"}
            }
            // , {
            //     "targets": {
            //         "node": "current"
            //     }
            // }
        ],
    ],
}


