import * as path from 'path';
import * as webpack from 'webpack';
// import nodeExternals from 'webpack-node-externals';

const entryPlus = require('webpack-entry-plus');
const glob = require('glob');

const paths = {
    nodeModules: path.resolve(__dirname, 'node_modules'),
    dist: path.resolve(__dirname, 'dist'),
    src: path.resolve(__dirname, 'src'),
};

const lambda: webpack.Configuration = {
    entry: entryPlus([
        {
            entryFiles: glob.sync('./src/**/provider/index.ts'),
            outputName: (it: string) => it.replace('src', '').replace('.ts', '')
        },
    ]),
    output: {
        path: paths.src,
        filename: '[name].js',
        publicPath: '',
        libraryTarget: 'commonjs2'
    },
    optimization: {
        minimize: false
    },
    mode: 'development',
    target: 'node',
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: ['ts-loader'],
                exclude: [paths.nodeModules],
            },
        ],
    },
    devtool: false,
    plugins: [
        // new WebpackManifestPlugin(),
        // new BundleAnalyzerPlugin(),
    ]
};

export default [
    lambda
];
