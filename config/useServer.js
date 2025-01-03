export default () => ({
    host: '0.0.0.0',
    strictPort: false,
    proxy: {
        '/api': {
            target: 'https://apifoxmock.com/m1/3156808-0-default',
            changeOrigin: true,
            rewrite: (path) => path.replace('/api', ''),
        },
    },
})
