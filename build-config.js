import path from 'path';
import fs from 'fs';

const config = `{
    entry: './demo.js',
    output: {
        filename: 'webpack-output.js',
        path: '${path.resolve('webpack-output').replace(/\\/g, '\\\\')}',
    },
    optimization: {
        minimizer: [false]
    },
    module: {
        rules: [
            {
                test: /\\.node$/,
                loader: 'node-loader',
            },
        ],
    },
    externals: [
        ({ context, request }, callback) => {
            if (/\\.node$/.test(request)) {
                return callback(null, 'commonjs ' + request);
            }
            callback();
        },
    ],
    target: 'node',
    mode: 'production',
}`

fs.writeFileSync('webpack.config.js', `export default ${config}`);