<template>
	<cl-crud @load="onLoad" :ref="setRefs('crud')">
		<el-row type="flex" class="topBtn">
			<cl-flex1 />
			<cl-add-btn />
		</el-row>
		<el-row>
			<el-tabs style="width: 100%" v-model="tab">
				<el-tab-pane
					v-for="(item, index) in list"
					:label="item.label"
					:key="index"
					:name="item.label"
				>
					<cl-table v-bind="table" />
				</el-tab-pane>
				<div style="padding: 10px 0; text-align: right" v-if="tab === '邮箱设置'">
					<el-button size="mini" type="info" @click="sendTestEmail"
						>测试发送邮件
					</el-button>
					<cl-form :ref="setRefs('emailForm')" />
				</div>
			</el-tabs>
		</el-row>

		<cl-upsert :sync="true" :key="'key-' + componentKey" :ref="setRefs('upsert')" v-bind="upsert" @open="onOpen" />
	</cl-crud>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, inject, nextTick, reactive, ref, watch} from "vue";
import { useRefs } from "/@/cool";
import { CrudLoad, QueryList, Table, Upsert } from "@cool-vue/crud/types";
import { ElMessage } from "element-plus";

export default defineComponent({
	name: "sys-setting",
	setup() {
		const service = inject<any>("service");

		const list = ref<QueryList[]>([]);

		let upsetItem = ref([
			{
				prop: "form_name",
				label: "名称",
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入名称"
					}
				},
				rules: {
					required: true,
					message: "名称不能为空"
				}
			},
			{
				prop: "group",
				label: "分组",
				component: {
					name: "el-select",
					props: {
						clearable: true,
						filterable: true,
						allowCreate: true,
						placeholder: "请选择分组或创建新分组"
					},
					options: list
				},
				rules: {
					required: true,
					message: "名称不能为空"
				}
			},
			{
				prop: "key",
				label: "键名",
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入Key"
					}
				},
				rules: {
					required: true,
					message: "Key不能为空"
				}
			},
			{
				prop: "value",
				label: "值",
				component: "el-input"
			},
			{
				prop: "listorder",
				label: "排序",
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入Key"
					}
				}
			},
			{
				prop: "remark",
				label: "备注",
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入备注",
						rows: 3,
						type: "textarea"
					}
				}
			}
		]);

		let { ctx } = getCurrentInstance()

		const { refs, setRefs } = useRefs();
		const tab = ref<String>("");
		// 表格配置
		const table = reactive<Table>({
			props: { "default-sort": { prop: "listorder", order: "descending" } },
			columns: [
				{
					label: "名称",
					prop: "form_name",
					width: 120,
					align: "left"
				},
				{
					label: "键名",
					prop: "key",
					width: 200,
					align: "left"
				},
				{
					label: "分组",
					prop: "group",
					width: 100
				},
				{
					label: "值",
					prop: "value",
					showOverflowTooltip: true,
					align: "left"
				},
				{
					label: "备注",
					prop: "remark",
					width: 250,
					align: "left",
					showOverflowTooltip: true
				},
				{
					label: "操作",
					type: "op",
					width: 80,
					buttons: ["edit"]
				}
			]
		});
		// 新增编辑配置
		let upsert = reactive<Upsert>({width: "1000px", items: upsetItem.value,});

		const componentKey = ref(0)

		// 刷新列表
		function refresh(params: any) {
			refs.value.crud.refresh(params);
		}

		watch(
			() => tab.value,
			(val) => {
				refresh({ group: val });
			}
		);

		watch(
			() => upsetItem.value,
			(val) => {
				upsert.items = upsetItem.value
				console.log(componentKey)
				upsert = reactive<Upsert>({width: "1000px", items: upsetItem.value,});
			},
			{
				deep: true
			}
		);

		// crud 加载
		async function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.system.setting).done();
			list.value = await service.system.setting.groupList();
			tab.value = list.value[0].label;
		}

		// 监听打开
		function onOpen(isEdit: boolean, data: any) {
			if (!data.editor) data.editor = "el-input";
			try {
				upsetItem.value[3].component = JSON.parse(data.editor);
			} catch (e) {
				console.log(e);
				upsetItem.value[3].component = data.editor;
			}
			upsetItem.value[3].component= "cms-map-editor";
			componentKey.value++;

			console.log(upsetItem.value[3].component);
		}

		function sendTestEmail() {
			refs.value.emailForm.open({
				items: [
					{
						label: "接收邮箱",
						prop: "email",
						component: {
							name: "el-input",

							attrs: {
								placeholder: "请填写接收邮箱"
							}
						},
						rules: {
							required: true,
							message: "接收邮箱不能为空"
						}
					},
					{
						label: "标题",
						prop: "title",
						value: "测试邮箱",
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写接收标题"
							}
						},
						rules: {
							required: true,
							message: "接收邮箱不能为空"
						}
					},
					{
						label: "邮箱内容",
						prop: "content",
						value: "测试邮箱内容~",
						component: {
							name: "cl-editor-quill",
							props: {
								height: 500
							}
						},
						rules: {
							required: true,
							message: "邮箱内容必须填写"
						}
					}
				],
				on: {
					submit: (data: any, { close, done }: any) => {
						service.system.setting
							.sendTestEmail(data)
							.then(() => {
								ElMessage.success("发送成功");
								done();
								close();
							})
							.catch((e: any) => {
								done();
								ElMessage.error(e);
							});
					}
				}
			});
		}

		return {
			table,
			upsert,
			setRefs,
			onLoad,
			list,
			tab,
			refresh,
			onOpen,
			componentKey,
			sendTestEmail
		};
	}
});
</script>

<style scoped>
.change-btn {
	display: flex;
	position: absolute;
	right: 10px;
	bottom: 10px;
	z-index: 9;
}

.cl-crud > .topBtn {
	position: absolute;
	z-index: 888;
	right: 20px;
	top: 20px;
}

.editor {
	transition: all 0.3s;
}
</style>
