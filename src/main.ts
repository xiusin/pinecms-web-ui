import { createApp } from "vue";
import App from "./App.vue";

// cool
import { bootstrap } from "./cool";

// router
import router from "./router";

// store
import store from "./store";

// mock
import "./mock";

// element-plus
import ElementPlus from "element-plus";

import "element-plus/theme-chalk/src/index.scss";

// import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// mitt
import mitt from "mitt";

// echarts
import VueECharts from "vue-echarts";

const app = createApp(App);

bootstrap(app)
	.then(() => {
		// echarts 可视图表
		app.component("v-chart", VueECharts);

		// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		// 	console.log(key, component);
		// 	app.component(key, component);
		// }

		// 事件通讯
		app.provide("mitt", mitt());

		app.use(store).use(router).use(ElementPlus).mount("#app");
	})
	.catch((err: string) => {
		console.error(`COOL-ADMIN 启动失败`, err);
	});

// 应用加载
store.dispatch("appLoad");

// @ts-ignore
window.__app__ = app;
