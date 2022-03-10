<template>
	<cl-crud @load="onLoad">
		<monaco-tree-editor
			:directory="rootNode"
			:tree-config="treeConfig"
			:get-actions="getActions"
			@on-click-file="onClickFile"
		/>

		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table v-bind="table" />
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert v-model="form" v-bind="upsert" />
	</cl-crud>
</template>

<script lang="ts">
import { CrudLoad, Table, Upsert } from "@cool-vue/crud/types";
import {defineComponent, inject, reactive, ref} from "vue";
import MonacoTreeEditor from "../components/monaco-tree/MonacoTree.vue";

export default defineComponent({
	name: "sys-tags",
	components: { MonacoTreeEditor },
	setup() {
		const service = inject<any>("service");

		const form = reactive<any>({ relevance: 1 });

		const upsert = reactive<Upsert>({
			items: [
				{
					prop: "name",
					label: "标签名称",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "名称"
						}
					},
					rules: {
						required: true,
						message: "名称不能为空"
					}
				},
				{
					prop: "listorder",
					label: "排序",
					span: 8,
					value: 0,
					component: {
						name: "el-input-number",
						props: {
							placeholder: "排序"
						}
					},
					rules: {
						required: true,
						message: "排序不能为空"
					}
				},
				{
					prop: "status",
					label: "状态",
					value: 1,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "启用",
								value: 1
							},
							{
								label: "禁用",
								value: 0
							}
						]
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "listorder",
					order: "descending"
				}
			},
			columns: [
				{
					prop: "name",
					label: "名称",
					minWidth: 80
				},
				{
					prop: "listorder",
					label: "排序",
					minWidth: 80
				},
				{
					prop: "ref_num",
					label: "引用数",
					minWidth: 150
				},
				{
					prop: "clicks",
					label: "点击数",
					minWidth: 150
				},
				{
					prop: "status",
					label: "状态",
					minWidth: 50,
					dict: [
						{
							label: "正常",
							value: 1,
							type: "success"
						},
						{
							label: "禁用",
							value: 0,
							type: "danger"
						}
					]
				},
				{
					label: "操作",
					type: "op"
				}
			]
		});

		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.system.tags).done();
			app.refresh();
		}





		const rootNode = ref(null);
		const treeConfig = ref(null);
		const rootDirectoryName = ref("demo");
		const lastClickedFile = ref(null);
		const lastClickedTime = ref(null);



		onMounted(() => {
			treeConfig.value = {
				dataSource: {
					/**
					 * Returns the unique identifier of the given element.
					 * No more than one element may use a given identifier.
					 */
					getId: function(tree, element){
						return element.key;
					},

					/**
					 * Returns a boolean value indicating whether the element has children.
					 */
					hasChildren: function(tree, element){
						return element.isDirectory;
					},

					/**
					 * Returns the element's children as an array in a promise.
					 */
					getChildren: function(tree, element){
						return Promise.resolve(element.children);
					},

					/**
					 * Returns the element's parent in a promise.
					 */
					getParent: function(tree, element){
						return Promise.resolve(element.parent);
					},
				},
				renderer: {
					getHeight: function(){
						return 24;
					},
					renderTemplate: function(tree, templateId, container) {
						return new FileTemplate(container);
					},
					renderElement: function(tree, element, templateId, templateData) {
						templateData.set(element);
					},
					disposeTemplate: function() {
						FileTemplate.dispose();
					}
				},
				//tree config requires a controller property but we would defer its initialisation
				//to be done by the MonacoTree component
				//controller: createController(this, this.getActions.bind(this), true),
				dnd: new TreeDnD()
			};
			rootNode.value = generateDirectoryTree(directoryListing, rootDirectoryName.value)
		});
		const getActions = (file) => {
			const actions = [];
			// Directory options
			if (file.isDirectory) {
				actions.push(new Action("1", "New File", "", true, () => {
					console.log("action New File on " + file.name);
				}));
				//menu separator
				actions.push(new Separator());
				actions.push(new Action("2", "New Directory", "", true, () => {
					console.log("action New Directory on " + file.name);
				}));
				actions.push(new Action("3", "Upload Files", "", true, () => {
					console.log("action Upload Files on " + file.name);
				}));

			}

			actions.push(new Action("4", "Download", "", true, () => {
				console.log("action Download on " + file.name);
			}));

			actions.push(new Action("5", "Delete", "", true, () => {
				console.log("action Delete on " + file.name);
			}));
			return actions;
		}

		const onDoubleClickFile = (file) => {
			console.log(file.name + " double clicked");
		};
		const onClickFile = (file) => {
			if (file.isDirectory) {
				return;
			}
			if (Date.now() - lastClickedTime.value < 500 && lastClickedFile.value === file) {
				onDoubleClickFile(file);
			}
			else {
				console.log(file.name + " clicked");
			}
			lastClickedTime.value = Date.now();
			lastClickedFile.value = file;
		};












		return {
			rootNode,
			treeConfig,
			rootDirectoryName,
			getActions,
			onClickFile,
			onDoubleClickFile,
			form,
			upsert,
			table,
			onLoad
		};
	}
});
</script>
