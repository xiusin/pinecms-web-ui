<template>
	<div ref="wrapper" :class="`monaco-with-tree${isFullScreen ? ' full-screen' : ''}`">
		<splitpanes style="height: 100%">
			<pane size="15">
				<cms-monaco-tree />
			</pane>
			<pane>
				<div class="monaco-right-pane">
					<div class="monaco-editor-menu">
						<el-button-group size="mini">
							<el-button :icon="Edit">保存</el-button>
							<el-button :icon="Edit">保存全部</el-button>
							<el-button :icon="Edit">刷新</el-button>
							<el-button :icon="Delete">字体大小</el-button>
							<el-button :icon="Delete">帮助</el-button>
						</el-button-group>
					</div>
					<i
						@click="toggleFullScreen"
						:class="
							'btn-fullscreen ' + (isFullScreen ? 'el-icon-s-grid' : 'el-icon-menu')
						"
					></i>
					<div
						ref="monaco"
						:style="{
							height: `calc(100% - ${tabHeight}px)`,
							visibility2: currentTab ? 'visible' : 'hidden'
						}"
					></div>
					<div
						v-show="!currentTab"
						class="no-tab-pane"
						:style="{ height: `calc(100% - ${tabHeight}px)` }"
					>
						<div class="center-wrapper">请从左侧打开一个文件</div>
					</div>
				</div>
			</pane>
		</splitpanes>
		<div>
			<div class="row"> <div class="path woo-copy">/www/wwwroot/demo2.wooadmin.cn/public/h5/static/iconfont/iconfont.css</div> <div class="status"> <div class="cursor item">行:1,列:14</div> <div class="charset item">编码:UTF-8</div> <div class="tab item" data-type="css">Tab空格:2</div>  <div class="lang item">语言:css</div>  <div class="readonly item"> <i class="ace-icon ace-icon-24gl-unlock2"></i> </div> </div> </div>
		</div>
	</div>
</template>
<script>
import NiceMonacoTree from "nice-monaco-tree";
import * as monaco from "monaco-editor";

import { Pane, Splitpanes } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import {
	Edit,
	Share,
	Delete,
} from '@element-plus/icons-vue'
import CmsMonacoTree from "../components/components/cms_monaco_tree.vue";

let monacoEditor = null;
let monacoTree = null;

export default {
	components: {
		CmsMonacoTree,
		Splitpanes,
		Pane
	},
	props: {
		files: {
			type: Array,
			// default: () => [],
			default: () => [
				"package.json",
				"README.md",
				"index.js",
				"src/test.js",
				"src/index.js",
				"public/index.html"
			]
		},
		// 暂时只支持传一个文件
		defaultOpenFiles: {
			type: Array,
			default: () => [],
		},
		readonly: {
			type: Boolean,
			default: false
		},
		getFileContent: {
			type: Function,
			default: (filePath) => {
				return [`${filePath}`]
			}
		},
		getFileTitle: {
			type: Function,
			default: (filePath) => filePath.split("/").pop()
		},
		monacoConfig: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			tabHeight: 48,
			defaultSplitPercent: 0, // 默认菜单分隔宽度百分比
			minSplitPercent: 0, // 最小宽度百分比
			currentTab: "", // 当前标签的key
			tabs: [],
			isFullScreen: false,
			Edit,
			Share,
			Delete
		};
	},
	computed: {
		tabsMap() {
			const map = {};
			this.tabs.forEach((item) => (map[item.key] = item));
			return map;
		}
	},
	watch: {
		currentTab(val) {
			if (val) {
				this.openFile(val);
				monacoTree.setSelection(val);
			}
		}
	},
	created() {
	},
	mounted() {
		// 由于split组件必须按百分比设置宽度，这里手动计算
		const totalWith =
			parseInt(getComputedStyle(this.$refs.wrapper).width) ||
			document.documentElement.offsetWidth;
		this.defaultSplitPercent = (200 / totalWith) * 100;
		this.minSplitPercent = (100 / totalWith) * 100;
		// this.$nextTick(() => {
		// 	this.initMonacoTree();
		// });
	},
	// 组件销毁事件
	unmounted() {
		// 销毁编辑器
		monacoEditor && monacoEditor.dispose();
		monacoEditor = null;
	},
	methods: {
		initMonacoTree() {
			console.log(this.files);
			monacoTree = NiceMonacoTree.init(this.$refs.menu, {
				files: this.files,
				onClick: (filePath, file, fileIcon) => {
					this.openFile(filePath, file, fileIcon, true);
				},
				onDoubleClick: (filePath, file, fileIcon) => {
					this.openFile(filePath, file, fileIcon, true);
				}
			});
			monacoTree.set
			monacoTree.expandAll();
			setTimeout(() => {
				if (this.defaultOpenFiles && this.defaultOpenFiles[0]) {
					monacoTree.setSelection(this.defaultOpenFiles[0]);
				}
			});
		},
		getMonacoTree() {
			return monacoTree;
		},

		// 选中并打开某个文件
		setSelection(filePath) {
			monacoTree && monacoTree.setSelection(filePath);
		},
		initMonacoEditor(filePath) {
			const resp = this.getFileContent(filePath);
			const [left] = resp instanceof Array ? resp : [resp];
			const modeMap = {
				js: "javascript",
				json: "json",
				html: "html",
				md: "markdown"
			};
			const ext = filePath.slice(filePath.lastIndexOf(".") + 1);
			const language = modeMap[ext.toLowerCase()] || "javascript";
			if (!monacoEditor) {
				monacoEditor = monaco.editor.create(this.$refs.monaco, {
					theme: "vs-dark",
					fontSize: "14px",
					readOnly: false,
					// todo 切换文件时需要修改语言
					language
				});
			}

			monacoEditor.setValue(left);
		},
		openFile(filePath, file, fileIcon, isDoubleClick = true) {
			// const idx = this.tabs.findIndex(item => item.key === filePath);
			if (this.tabsMap[filePath]) {
				this.currentTab = filePath;
				if (isDoubleClick && this.tabsMap[filePath].tempOpen) {
					this.tabsMap[filePath].tempOpen = false;
				}
			} else {
				if (isDoubleClick) {
					// this.$refs.tab.addTab({
					// 	label: this.getFileTitle(filePath),
					// 	key: filePath,
					// 	closable: true,
					// 	// 默认的icon只支持传图片，这里我们直接使用monaco的icon class来实现图标展示
					// 	// 通过设置一个空的favicon来设置一个占位符
					// 	favicon: (h) => h("span"),
					// 	class: `monaco-icon-label ${fileIcon}`
					// });
					this.currentTab = filePath;
				} else {
				}
			}
			this.initMonacoEditor(filePath);
		},
		resize() {
		},
		toggleFullScreen() {
			this.isFullScreen = !this.isFullScreen;
		}
	}
};
</script>


<style lang="scss">

.splitpanes--vertical .splitpanes__pane {
	border-right: 1px solid #ccc;
	background: #fff;
}

.monaco-with-tree {
	height: 100%;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
	"Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
	-webkit-font-smoothing: antialiased;

&
.full-screen {
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh !important;
	z-index: 100000;
}

.monaco-menu-pane {
	height: 100%;
}

.monaco-right-pane {
	height: 100%;
	position: relative;

.monaco-editor-menu {
	padding-left: 10px;
	height: 40px;
	line-height: 35px;
	border-bottom: 1px solid #E4E7ED;
}


.vue-tabs-chrome {

*,
*::before,
*::after {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}

font-size: 14px;
.tabs-item.monaco-icon-label::before {
	box-sizing: content-box;
	position: absolute;
	left: 22px;
	top: 5px;
	z-index: 1;
}

}
.no-tab-pane {
	text-align: center;
	position: absolute;
	left: 0;
	top: 28px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

}
.btn-fullscreen {
	position: absolute;
	top: 4px;
	right: 8px;
	z-index: 2000;
	color: white;
	width: 24px;
	height: 24px;
	text-align: center;
	line-height: 24px;
	cursor: pointer;
	opacity: 0.8;

&
.fullscreen {
	position: fixed;
}

&
:hover {
	opacity: 1;
}

}
}
</style>
