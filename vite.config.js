import {
	defineConfig
} from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
	ElementPlusResolver
} from 'unplugin-vue-components/resolvers'

// 获取当前环境下的域名
// const domain = process.env.NODE_ENV == 'production' ? process.env.VITE_APP_BASE_API : '';
export default defineConfig({
	plugins: [vue(), AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	resolve: {
		alias: {
			// 确保 Vite 能够正确解析 node_modules 中的模块
			'@': '/src'
		},
	},
	server: {
		allowedHosts: [
			"www.lovepartya.com", // 添加这一行
			// 如果你还有其他允许的主机，也可以继续添加到这个数组中
		],
		// 可添加自定义 MIME 类型映射
		mimeTypes: {
			'application/json': ['json']
		},
		host: '0.0.0.0', // 允许通过 IP 地址访问
		port: 5000, // 可根据需要指定端口
		proxy: {
			// 当前端请求以 /api 开头的接口时，会被代理到 target 指向的地址
			'/post': {
				target: 'https://www.fastmock.site/mock/48cab8545e64d93ff9ba66a87ad04f6b/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
		// hmr:false
	},
	build: {
		sourcemap: true
	}
	// server: {
	// 	proxy: {
	// 		'/api': {
	// 			target: 'https://154.39.81.208',
	// 			changeOrigin: true,
	// 			rewrite: (path) => path.replace(/^\/api/, '')
	// 		}
	// 	},
	// }
})