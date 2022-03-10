<template>
	<div class="view-home scroller1">
		<el-row :gutter="15">
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-sales />
				</div>
			</el-col>
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-views />
				</div>
			</el-col>
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-paid />
				</div>
			</el-col>
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-effect />
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="15">
			<el-col :lg="14" :xs="24">
				<div class="card">
					<tab-chart />
				</div>
			</el-col>
			<el-col :lg="10" :xs="24">
				<div class="card">
					<sales-rank />
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="15">
			<el-col :lg="14" :sm="24">
				<div class="card card--last">
					<hot-search />
				</div>
			</el-col>
			<el-col :lg="10" :sm="24">
				<div class="card card--last">
					<category-ratio />
				</div>
			</el-col>
		</el-row>


		<el-row :gutter="15">
			<el-col :lg="10" :sm="24">
			<monaco
				:files="files"
				:default-open-files="defaultOpenFiles"
				:get-file-content="getFileContent"
			/>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CategoryRatio from "./components/category-ratio.vue";
import CountSales from "./components/count-sales.vue";
import CountViews from "./components/count-views.vue";
import CountPaid from "./components/count-paid.vue";
import CountEffect from "./components/count-effect.vue";
import TabChart from "./components/tab-chart.vue";
import SalesRank from "./components/sales-rank.vue";
import HotSearch from "./components/hot-search.vue";

import Monaco from "../../cool/modules/base/components/monaco/MonacoEditor.vue";

export default defineComponent({
	components: {
		Monaco,
		CategoryRatio,
		CountSales,
		CountViews,
		CountPaid,
		CountEffect,
		TabChart,
		SalesRank,
		HotSearch
	},
	setup() {
		let files = ref(['package.json',  'README.md', 'index.js', 'js/test.js', 'css/index.css', 'img/test.png', 'models/test.js', 'controllers/index.js', 'templates/index.js', 'views/test.js', 'src/index.js', 'public/index.html'])
		let defaultOpenFiles = ref(['package.json'])

		function getFileContent(filePath: String) {
			if (filePath.endsWith('.html')) {
				return [`<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`, `<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>测试标题修改</title>
    <link rel="stylesheet" href="//at.alicdn.com/t/font_1140662_gszsvhbv63l.css">
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`];
			}
			if (filePath.endsWith('.json')) {
				return [`{
    "name": "${filePath}",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "serve": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    },
    "dependencies": {
        "core-js": "^3.6.5",
        "vue": "^2.6.11"
    },
    }`, `{
    "name": "monaco-with-tree",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "dev": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    },
    "dependencies": {
        "core-js": "^3.6.5",
        "monaco-editor": "^0.30.1",
        "nice-monaco-tree": "^1.0.3",
        "vue": "^2.6.11",
        "vue-splitpane": "^1.0.6",
        "vue-tabs-chrome": "^0.10.0"
    },
    }`];
			}
			if (filePath.endsWith('.js')) {
				return [`let current = '${filePath}';
        for(let i = 0; i < pathLen; i++){
            let name = pathArr[i];
            let index = i;`, `let current = '${filePath}';
        let keyPrefix = root;
        for(let i = 0; i < pathLen; i++){
            let name = pathArr[i];
            keyPrefix = 1234;
            let index = i;`]
			}
			return [`${filePath}-left`, `${filePath}-right`];
		}
		return {files , defaultOpenFiles, getFileContent}
	}
});
</script>

<style lang="scss">
.view-home {
	.card {
		background-color: #fff;
		border-radius: 5px;
		margin-bottom: 15px;
		font-size: 12px;
		letter-spacing: 0.5px;

		&__header {
			display: flex;
			align-items: center;
			height: 50px;
			padding: 0 20px;

			.label {
				font-size: 12px;
			}

			.value {
				font-size: 18px;
				font-weight: bold;
				margin-left: 10px;
			}
		}

		&__container {
			padding: 0 20px;
			height: 50px;
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			border-top: 1px solid #f7f7f7;
			font-size: 12px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;

			.label {
				margin-right: 10px;
			}

			.value {
				font-size: 13px;
			}
		}
	}
}
</style>
