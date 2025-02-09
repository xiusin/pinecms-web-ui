<template>
	<div class="system-user">
		<div class="pane">
			<div class="dir">
				<div class="container">
					<el-tree
						ref="treeRef"
						node-key="menuId"
						:data="treeList"
						:props="{ label: 'name', children: 'children' }"
						:highlight-current="true"
						:expand-on-click-node="false"
						:default-expanded-keys="expandedKeys"
						@current-change="onCurrentChange"
					/>
				</div>
			</div>

			<div class="editor">
				<div class="container">
					<cl-crud
						:ref="setRefs('crud')"
						@load="onLoad"
						:on-delete="onDelete"
						v-if="!catType"
					>
						<el-row>
							<cl-refresh-btn />
							<cl-add-btn />
							<cl-flex1 />
							<cl-adv-btn />
							<cl-search-key />
							<cl-adv-search
								:items="advItemList"
								:props="{ size: '50%' }"
								:op-list="opAdvList"
							/>
						</el-row>

						<el-row>
							<cl-table
								:v-show="initedRef"
								:ref="setRefs('table')"
								v-bind="table"
								:props="{
									height: '700px',
									fit: true,
									'highlight-current-row': true,
									stripe: true,
									'max-height': 900
								}"
								:autoHeight="false"
							/>
						</el-row>

						<el-row type="flex">
							<cl-flex1 />
							<cl-pagination />
						</el-row>

						<cl-upsert
							:ref="setRefs('upsert')"
							:items="upsert.items"
							:on-info="onInfo"
							:dialog="{ props: { fullscreen: true }, controls: ['close'] }"
						/>
					</cl-crud>
					<template v-if="catType === 1">
						<div style="padding: 20px">
							<el-breadcrumb separator-class="el-icon-arrow-right">
								<el-breadcrumb-item>内容管理</el-breadcrumb-item>
								<el-breadcrumb-item>发布</el-breadcrumb-item>
								<el-breadcrumb-item>编辑单页</el-breadcrumb-item>
							</el-breadcrumb>
							<el-divider content-position="left">页面信息</el-divider>
							<cl-form :ref="setRefs('form')" inner />
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onBeforeMount, reactive, ref, watch } from "vue";
import { useRefs } from "/@/cool";
import { deepTree } from "/@/cool/utils";
import { QueryList, Table, Upsert } from "@cool-vue/crud/types";
import { ElMessage } from "element-plus";

export default defineComponent({
	name: "sys-content",
	setup() {
		//todo 通过配置文件注入变量. 引用
		// const $ueditorConf = {
		// 	serverUrl: "/api/web/upload/ueditor",
		// 	UEDITOR_HOME_URL: "/UEditor/",
		// 	autoHeightEnabled: false,
		// 	initialFrameHeight: 400,
		// 	initialFrameWidth: "100%",
		// 	enableAutoSave: false
		// };

		// let renders = {
		// 	singleImage: ({ h, scope }) => {
		// 		console.log(scope)
		// 		return h("img", {
		// 				props: {
		// 					fit: "contain",
		// 					lazy: true,
		// 				},
		// 				src: scope.thumb
		// 			},
		// 		);
		// 	}
		// };

		const service = inject<any>("service");

		const { refs, setRefs } = useRefs();

		const data = ref([]);

		const modelValue = ref("");
		// 树形列表
		const menuList = ref<any[]>([]);
		// 展开值
		const expandedKeys = ref<any[]>([]);
		// 栏目树结构
		const treeRef = ref<any>({});
		// 抽屉
		const drawerRef = ref(true);
		const initedRef = ref(false);
		const catType = ref<any>(0);

		// 绑定值回调
		function onCurrentChange({ id, catname, type, model_id }: any) {
			catId.value = id;
			catName.value = catname;
			catType.value = type;
			if (catType.value == 0) {
				midRef.value = model_id;
				refresh({ cid: catId.value });
			} else if (catType.value == 1) {
				service.system.content.getPageInfo({ id: catId.value }).then((data: any) => {
					refs.value.form.open({
						form: data,
						items: [
							{
								label: "标题",
								prop: "title",
								component: {
									name: "el-input",
									attrs: {
										placeholder: "请填写标题"
									}
								},
								rules: {
									required: true,
									message: "请填写标题"
								}
							},
							{
								label: "关键字",
								prop: "keywords",
								component: {
									name: "el-input",
									attrs: {
										placeholder: "请填写关键字"
									}
								}
							},
							{
								label: "描述",
								prop: "description",
								component: {
									name: "el-input",
									attrs: {
										type: "textarea",
										rows: 4,
										placeholder: "请填写关键字"
									}
								}
							},
							{
								label: "内容",
								prop: "content",
								component: {
									name: "cl-editor-quill",
									props: {
										height: 600
									}
								}
							}
						],
						op: {
							saveButtonText: "确定",
							buttons: ["save"]
						},
						on: {
							submit: (data: any, { done }: any) => {
								service.system.content
									.savePageInfo(data)
									.then(() => {
										ElMessage.success("保存成功");
										done();
									})
									.catch((e: any) => {
										ElMessage.error(e);
										done();
									});
							}
						}
					});
				});
			}
		}

		// 表格配置
		const table = ref<Table>();
		// 树形列表
		const treeList = computed(() => deepTree(menuList.value));
		const advItemList = ref([]);
		const catId = ref<any>(0);
		const midRef = ref<any>(0);
		const catName = ref<string>("");
		const catKey = ref<string>("");

		onBeforeMount(async function () {
			const ret = await service.system.category.list({ type: "content" });
			menuList.value = ret.list.filter((e: any) => e.type != 2);
			catId.value = menuList.value[0].id;

			catName.value = menuList.value[0].catname;
			catType.value = menuList.value[0].type;
			if (catType.value == 0) {
				midRef.value = menuList.value[0].model_id;
				refresh({ cid: catId.value });
			}
		});

		const list = ref<QueryList[]>([]);

		const upsert = reactive<Upsert>({
			items: []
		});

		// 刷新列表
		function refresh(params: any) {
			if (!catType.value) {
				setTimeout(() => refs.value.crud?.refresh(params), 10);
			}
		}

		// 刷新监听
		async function onInfo(data, { done }) {
			let info = await service.system.content.info({
				id: data.id,
				mid: midRef.value
			});
			done(info);
		}

		// crud 加载
		async function onLoad({ ctx }: any) {
			const originalAdd = service.system.content.add;
			service.system.content.add = async (data) => {
				const _data = { ...data, mid: midRef.value, catid: catId.value };
				return originalAdd.call(service.system.content, _data);
			};

			ctx.service(service.system.content).done();
		}

		function onDelete(selection: any, { next }: any) {
			next({
				ids: selection.map((e) => e.id),
				mid: midRef.value
			});
		}

		watch(midRef, (newValue) => {
			midRef.value = newValue;
			service.system.model.modelTable({ mid: newValue }).then((data: any) => {
				initedRef.value = true;
				data.columns.map((item: any) => {
					if (item.component) {
						item.component =
							typeof item.component == "string"
								? Function("return " + item.component)()
								: item.component;
					}
					return item;
				});

				data.upset_comps.map((item: any) => {
					let props = item.component.props;
					for (const propsKey in props) {
						if (/^@\w.+/.test(props[propsKey])) {
							try {
								props[propsKey] = eval("$" + props[propsKey].substr(1));
							} catch (e) {
								console.error(e);
							}
						}
					}
					return item;
				});
				advItemList.value = data.search_fields || [];
				upsert.items = data.upset_comps;
				table.value = data;
				table.value?.columns.push({
					label: "操作",
					type: "op",
					buttons: ["edit", "delete"]
				});
			});
		});

		const opAdvList = ref<string[]>(["search", "reset", "clear", "close"]);

		return {
			opAdvList,
			advItemList,
			service,
			data,
			refs,
			expandedKeys,
			setRefs,
			drawerRef,
			initedRef,
			modelValue,
			table,
			menuList,
			upsert,
			list,
			onLoad,
			onInfo,
			catName,
			catKey,
			catId,
			treeList,
			refresh,
			onDelete,
			treeRef,
			catType,
			onCurrentChange
		};
	}
});
</script>

<style lang="scss" scoped>
.el-tree-node__label {
	font-size: 12px;
}
.system-user {
	.pane {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.dir {
		height: 100%;
		width: 180px;
		padding: 10px;
		max-width: calc(100% - 50px);
		background-color: #fff;
		transition: width 0.3s;
		margin-right: 10px;
		flex-shrink: 0;

		& ._collapse {
			margin-right: 0;
			width: 0;
		}
	}

	.editor {
		width: calc(100% - 190px);
		flex: 1;
		background-color: #fff;

		.header {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40px;
			position: relative;
			background-color: #fff;

			span {
				font-size: 14px;
				white-space: nowrap;
				overflow: hidden;
			}

			.icon {
				position: absolute;
				left: 0;
				top: 0;
				font-size: 18px;
				cursor: pointer;
				background-color: #fff;
				height: 40px;
				width: 80px;
				line-height: 40px;
				padding-left: 10px;
			}
		}
	}

	.dept,
	.user {
		overflow: hidden;

		.container {
			height: calc(100% - 40px);
		}
	}

	@media only screen and (max-width: 768px) {
		.dept {
			width: calc(100% - 100px);
		}
	}
}
</style>
