<template>
	<cl-crud @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-flex1 />
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
import { defineComponent, inject, reactive } from "vue";

export default defineComponent({
	name: "sys-level",

	setup() {
		const service = inject<any>("service");

		// 表单值
		const form = reactive<any>({
			relevance: 1
		});

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: [
				{
					prop: "name",
					label: "职级名称",
					span: 24,
					component: {
						name: "el-input",
						props: {
							placeholder: "请输入职级名称"
						}
					},
					rules: {
						required: true,
						message: "职级名称不能为空"
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
								label: "启用",
								value: true
							},
							{
								label: "禁用",
								value: false
							}
						]
					}
				},
				{
					prop: "listorder",
					label: "排序号",
					span: 12,
					component: {
						name: "el-input-number",
						min: 0
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "listorder",
					order: "asccending"
				}
			},
			columns: [
				{
					prop: "id",
					label: "ID",
					width: 80
				},
				{
					prop: "name",
					label: "名称",
					width: 180,
					align: "left"
				},
				{
					prop: "listorder",
					label: "排序号",
					width: 120
				},
				{
					prop: "status",
					label: "状态",
					dict: [
						{
							label: "启用",
							value: true,
							type: "success"
						},
						{
							label: "禁用",
							value: false,
							type: "danger"
						}
					]
				},
				{
					prop: "created",
					label: "创建时间"
				},
				{
					prop: "updated",
					label: "更新时间"
				},
				{
					label: "操作",
					type: "op"
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.system.level).done();
			app.refresh();
		}

		return {
			form,
			upsert,
			table,
			onLoad
		};
	}
});
</script>
