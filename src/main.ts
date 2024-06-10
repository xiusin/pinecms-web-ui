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

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// mitt
import mitt from "mitt";

// echarts
import VueECharts from "vue-echarts";

import ElementPro from "element-pro-components";

const app = createApp(App);

bootstrap(app)
	.then(() => {
		app.component("v-chart", VueECharts);
		app.use(ElementPlus);
		app.use(ElementPro);
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
		}
		app.provide("mitt", mitt());
		app.use(store).use(router).mount("#app");
	})
	.catch((err: string) => {
		console.error(`COOL-ADMIN 启动失败`, err);
	});

// 应用加载
store.dispatch("appLoad");

// @ts-ignore
window.__app__ = app;
