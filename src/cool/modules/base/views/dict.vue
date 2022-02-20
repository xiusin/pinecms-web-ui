<template>
	<el-container>
		<el-aside width="300px">
			<cl-crud
				:ref="setRefs('categoryCrud')"
				@load="onCategoryLoad"
				:on-refresh="onCategoryRefresh"
			>
				<el-main class="nopadding">
					<el-tree
						:ref="setRefs('tree')"
						class="menu"
						node-key="id"
						:data="treeList"
						:props="treeProps"
						:highlight-current="true"
						:expand-on-click-node="false"
						@node-click="categoryClick"
					>
						<template #default="{ node, data }">
							<span class="custom-tree-node">
								<el-tooltip v-if="data.remark" :content="data.remark" raw-content>
									<span class="label">{{ node.label }}</span>
								</el-tooltip>
								<span class="label" v-else>{{ node.label }}</span>

								<span class="code">{{ data.key }}</span>
								<span class="do">
									<el-icon @click.stop="categoryEdit(data)"><edit /></el-icon>
									<el-icon @click.stop="categoryDelete(data)"><delete /></el-icon>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="line-height: 40px">
					<cl-add-btn type="primary" size="mini" icon="el-icon-plus" style="width: 100%"
						>字典分类
					</cl-add-btn>
				</el-footer>
				<cl-upsert :ref="setRefs('categoryUpsert')" :items="categoryUpsert.items" />
				<cl-form :ref="setRefs('form')" />
			</cl-crud>
		</el-aside>
		<el-container class="is-vertical">
			<cl-crud :ref="setRefs('crud')" :on-refresh="onRefresh" @load="onLoad">
				<el-row type="flex">
					<cl-refresh-btn size="small" />
					<cl-add-btn size="small">新增{{ catName }}</cl-add-btn>
					<cl-flex1 />
					<cl-search-key size="small" />
				</el-row>

				<el-row><cl-table :ref="setRefs('table')" v-bind="table" /></el-row>
				<el-row type="flex"><cl-flex1 /><cl-pagination /></el-row>
				<cl-upsert
					:ref="setRefs('upsert')"
					:items="upsert.items"
					:on-open="onOpenUpsert"
					:on-submit="onSubmit"
				/>
			</cl-crud>
		</el-container>
	</el-container>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref } from "vue";
import { useRefs } from "/@/cool";
import { Table, Upsert } from "@cool-vue/crud/types";
import { ElMessage } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";

export default defineComponent({
	name: "sys-dict",
	components: {
		Edit,
		Delete
	},
	setup() {
		const service = inject<any>("service");
		const { refs, setRefs } = useRefs();
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "id",
					order: "descending"
				}
			},
			columns: [
				{
					prop: "name",
					label: "名称",
					width: 170,
					align: "left"
				},
				{
					prop: "value",
					align: "left",
					label: "值"
				},
				{
					prop: "cat_name",
					label: "所属分类",
					align: "left"
				},
				{
					prop: "status",
					label: "状态",
					minWidth: 50,
					dict: [
						{
							label: "正常",
							value: true,
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
					type: "op",
					buttons: ["edit", "delete"],
					width: 120
				}
			]
		});
		const treeList = ref([]);
		const catId = ref<any>(0);
		const catName = ref<any>("");
		const treeProps = ref({ label: "name" });
		const categoryUpsert = reactive<Upsert>({
			title: "添加字典",
			items: [
				{
					prop: "name",
					label: "字典名称",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写字典名称"
						}
					},
					rules: {
						required: true,
						message: "字典名称不能为空"
					}
				},
				{
					prop: "key",
					label: "字典标识",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写字典标识"
						}
					},
					rules: {
						required: true,
						message: "字典标识不能为空"
					}
				},
				{
					prop: "remark",
					label: "备注",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写备注",
							type: "textarea",
							rows: 4
						}
					}
				},
				{
					prop: "status",
					label: "状态",
					value: true,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "正常",
								value: true
							},
							{
								label: "禁用",
								value: false
							}
						]
					}
				}
			]
		});
		function categoryDelete(data: any) {
			refs.value.categoryCrud.rowDelete(data);
		}

		function categoryClick(data: any) {
			catId.value = data.id;
			catName.value = data.name;
			refs.value.crud.refresh({ cid: catId });
		}

		function categoryEdit(data: any) {
			refs.value.categoryCrud.rowEdit(data);
		}

		const upsert = reactive<Upsert>({
			items: [
				{
					prop: "name",
					label: "名称",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写名称"
						}
					},
					rules: {
						required: true,
						message: "名称不能为空"
					}
				},
				{
					prop: "value",
					label: "值",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写值",
							type: "textarea",
							rows: 4
						}
					},
					rules: {
						required: true,
						message: "值不能为空"
					}
				},
				{
					prop: "remark",
					label: "备注",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写备注",
							type: "textarea",
							rows: 4
						}
					}
				},
				{
					prop: "status",
					label: "状态",
					value: true,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "正常",
								value: true
							},
							{
								label: "禁用",
								value: false
							}
						]
					}
				}
			]
		});

		// crud 加载
		async function onLoad({ ctx, app }: any) {
			ctx.service(service.system.dict).done();
			app.refresh({ cid: catId });
		}

		// crud 加载
		function onCategoryLoad({ ctx, app }: any) {
			ctx.service(service.system.dictCategory).done();
			app.refresh();
		}

		// 分类数据刷新回调逻辑
		async function onCategoryRefresh(params: any, { next }: any) {
			const { list } = await next(params);
			catId.value = list[0].id;
			catName.value = list[0].name;
			treeList.value = list;
		}

		// 刷新监听
		async function onRefresh(params: any, { next, render }: any) {
			const { list } = await next(params);
			render(
				list.map((e: any) => {
					if (e.roleName) {
						e.roleNameList = e.roleName.split(",");
					}

					e.status = Boolean(e.status);

					return e;
				})
			);
			if (params.cid === 0) {
				refs.value.tree.setCurrentKey(catId.value);
				refs.value.crud.refresh({ cid: catId });
			}
		}

		function onOpenUpsert() {
			if (catId.value == 0) {
				ElMessage.error("请先选择要添加的目标分类");
				arguments[2].close();
			}
		}

		function onSubmit(isEdit, data, { done, close, next }) {
			next({
				...data,
				cid: catId.value
			});
			close();
		}

		return {
			onSubmit,
			categoryClick,
			categoryUpsert,
			categoryEdit,
			categoryDelete,
			treeProps,
			treeList,
			service,
			refs,
			table,
			upsert,
			setRefs,
			onLoad,
			onCategoryLoad,
			onRefresh,
			onCategoryRefresh,
			catId,
			catName,
			onOpenUpsert
		};
	}
});
</script>

<style scoped>
.custom-tree-node {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 24px;
	height: 100%;
}

.custom-tree-node .code {
	font-size: 12px;
	color: #999;
}

.custom-tree-node .do {
	display: none;
}

.custom-tree-node .do i {
	margin-left: 5px;
	color: #999;
	padding: 5px;
}

.custom-tree-node .do i:hover {
	color: #333;
}

.custom-tree-node:hover .code {
	display: none;
}

.custom-tree-node:hover .do {
	display: inline-block;
}
</style>
