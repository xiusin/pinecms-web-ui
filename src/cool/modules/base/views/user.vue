<template>
	<div class="system-user">
		<div class="pane">
			<!-- 组织架构 -->
			<div class="dept" :class="[isExpand ? '_expand' : '_collapse']">
				<cl-dept-tree
					@row-click="onDeptRowClick"
					@user-add="onDeptUserAdd"
					@list-change="onDeptListChange"
				/>
			</div>

			<!-- 成员列表 -->
			<div class="user">
				<div class="header">
					<div class="icon" @click="deptExpand">
						<i class="el-icon-arrow-left" v-if="isExpand"></i>
						<i class="el-icon-arrow-right" v-else></i>
					</div>

					<span>成员列表</span>
				</div>

				<div class="container">
					<cl-crud :ref="setRefs('crud')" :on-refresh="onRefresh" @load="onLoad">
						<el-row type="flex">
							<cl-refresh-btn />
							<cl-add-btn />
							<cl-multi-delete-btn />
							<!-- <el-button
								size="mini"
								type="success"
								:disabled="selects.ids.length == 0"
								@click="toMove()"
								>转移</el-button
							> -->
							<cl-flex1 />
							<cl-search-key />
						</el-row>

						<el-row>
							<cl-table
								:ref="setRefs('table')"
								v-bind="table"
								@selection-change="onSelectionChange"
							>
								<!-- 头像 -->
								<template #column-avatar="{ scope }">
									<cl-avatar
										shape="square"
										size="medium"
										:src="scope.row.avatar"
										:style="{ margin: 'auto' }"
									/>
								</template>

								<!-- 权限 -->
								<template #column-roleName="{ scope }">
									<el-tag
										v-for="(item, index) in scope.row.roleNameList"
										:key="index"
										disable-transitions
										size="small"
										effect="dark"
										style="margin: 2px"
										>{{ item }}</el-tag
									>
								</template>

								<!-- 单个转移 -->
								<template #slot-move-btn="{ scope }">
									<el-button type="text" size="mini" @click="toMove(scope.row)"
										>转移</el-button
									>
								</template>
							</cl-table>
						</el-row>

						<el-row type="flex">
							<cl-flex1 />
							<cl-pagination />
						</el-row>

						<cl-upsert
							:ref="setRefs('upsert')"
							v-bind="upsert"
							:on-submit="onUpsertSubmit"
						/>
					</cl-crud>
				</div>
			</div>
		</div>

		<!-- 部门移动 -->
		<cl-dept-move :ref="setRefs('dept-move')" @success="refresh({ page: 1 })" />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRefs } from "/@/cool";
import { Table, Upsert } from "@cool-vue/crud/types";
export default defineComponent({
	name: "sys-user",
	setup() {
		// const { refs, setRefs, store, service } = useCool();
		const service = inject<any>("service");
		const store = useStore();
		const { refs, setRefs } = useRefs();
		// 是否展开
		const isExpand = ref<boolean>(true);
		// 选择项
		const selects = reactive<any>({
			dept: {},
			ids: []
		});
		// 部门列表
		const dept = ref<any[]>([]);
		// 表格配置
		const table = reactive<Table>({
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					prop: "avatar",
					label: "头像"
				},
				{
					prop: "realname",
					label: "姓名",
					minWidth: 150
				},
				{
					prop: "username",
					label: "用户名",
					minWidth: 150
				},
				{
					prop: "email",
					label: "邮箱",
					minWidth: 150
				},
				{
					prop: "roleName",
					label: "角色",
					headerAlign: "center",
					minWidth: 200
				},
				{
					prop: "remark",
					label: "备注",
					minWidth: 150
				},
				{
					prop: "status",
					label: "状态",
					minWidth: 120,
					dict: [
						{
							label: "启用",
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
					type: "op",
					buttons: ["edit", "delete"],
					width: 160
				}
			]
		});
		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			dialog: {
				width: "800px"
			},
			items: [
				{
					prop: "avatar",
					label: "头像",
					span: 24,
					component: {
						name: "cl-upload",
						props: {
							text: "选择头像",
							size: 100,
							icon: "el-icon-picture"
						}
					}
				},
				{
					prop: "username",
					label: "用户名",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "用户名"
						}
					},
					rules: {
						required: true,
						message: "用户名不能为空"
					}
				},

				{
					prop: "realname",
					label: "姓名",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写姓名"
						}
					}
				},

				{
					prop: "sex",
					label: "性别",
					span: 12,
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "男",
								value: 1
							},
							{
								label: "女",
								value: 0
							}
						]
					}
				},
				{
					prop: "birthday",
					label: "生日",
					span: 12,
					component: {
						name: "el-date-picker",
						props: {
							type: "date",
							placeholder: "请选择生日",
							valueFormat: "YYYY-MM-DD 00:00:00"
						}
					}
				},

				{
					prop: "email",
					label: "邮箱",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写邮箱"
						}
					},
					rules: [
						{
							required: true,
							message: "姓名不能为空"
						}
					]
				},
				{
					prop: "phone",
					label: "手机",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写手机"
						}
					}
				},
				{
					prop: "department_id",
					label: "部门",
					span: 12,
					value: 0,
					component: {
						name: "cms-select",
						props: {
							service: service.system.department
						}
					},
					rules: {
						required: true,
						message: "角色不能为空"
					}
				},
				{
					prop: "level_id",
					label: "职级",
					span: 12,
					value: 0,
					component: {
						name: "cms-select",
						props: {
							service: service.system.level
						}
					},
					rules: {
						required: true,
						message: "角色不能为空"
					}
				},
				{
					prop: "position_id",
					label: "岗位",
					span: 12,
					value: 0,
					component: {
						name: "cms-select",
						props: {
							service: service.system.position
						}
					},
					rules: {
						required: true,
						message: "岗位不能为空"
					}
				},
				{
					prop: "password",
					label: "密码",
					span: 12,
					component: {
						name: "el-input",
						props: {
							placeholder: "请填写密码",
							type: "password"
						}
					},
					rules: [
						{
							min: 6,
							max: 16,
							message: "密码长度在 6 到 16 个字符"
						}
					]
				},
				{
					prop: "roleIdList",
					label: "角色",
					span: 24,
					value: [],
					component: {
						name: "cl-role-select",
						props: {
							props: {
								"multiple-limit": 3
							}
						}
					},
					rules: {
						required: true,
						message: "角色不能为空"
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
					value: 1,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "开启",
								value: 1
							},
							{
								label: "关闭",
								value: 0
							}
						]
					}
				}
			]
		});
		// 浏览器信息
		const browser = computed(() => store.getters.browser);
		// 监听屏幕大小变化
		watch(
			() => browser.value.isMini,
			(val: boolean) => {
				isExpand.value = !val;
			},
			{
				immediate: true
			}
		);
		// crud 加载
		function onLoad({ ctx, app }: any) {
			ctx.service(service.system.user).done();
			app.refresh();
		}
		// 刷新列表
		function refresh(params: any) {
			refs.value.crud.refresh(params);
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
		}
		// 提交钩子
		function onUpsertSubmit(_: boolean, data: any, { next }: any) {
			let departmentId = data.departmentId;
			if (!departmentId) {
				departmentId = selects.dept.id;
				if (!departmentId) {
					departmentId = dept.value[0].id;
				}
			}
			next({
				...data,
				department_id: departmentId
			});
		}
		// 多选监听
		function onSelectionChange(selection: any[]) {
			selects.ids = selection.map((e) => e.id);
		}
		// 部门选择监听
		function onDeptRowClick({ item, ids }: any) {
			selects.dept = item;
			refresh({
				page: 1,
				departmentIds: ids
			});
			// 收起
			if (browser.value.isMini) {
				isExpand.value = false;
			}
		}
		// 部门下新增成员
		function onDeptUserAdd(item: any) {
			refs.value.crud.rowAppend({
				departmentId: item.id
			});
		}
		// 部门列表监听
		function onDeptListChange(list: any[]) {
			console.log("dept.value", dept.value);
			dept.value = list;
		}
		// 是否显示部门
		function deptExpand() {
			isExpand.value = !isExpand.value;
		}
		// 移动成员
		async function toMove(e?: any) {
			let ids = [];
			if (!e) {
				ids = selects.ids;
			} else {
				ids = [e.id];
			}
			refs.value["dept-move"].toMove(ids);
		}
		return {
			service,
			refs,
			isExpand,
			selects,
			dept,
			table,
			upsert,
			browser,
			setRefs,
			onLoad,
			refresh,
			onRefresh,
			onUpsertSubmit,
			onSelectionChange,
			onDeptRowClick,
			onDeptUserAdd,
			onDeptListChange,
			deptExpand,
			toMove
		};
	}
});
</script>

<style>
.cl-dept-tree__node-label {
	font-size: 12px;
}
</style>

<style lang="scss" scoped>
.system-user {
	.pane {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}
	.dept {
		height: 100%;
		width: 300px;
		max-width: calc(100% - 50px);
		background-color: #fff;
		transition: width 0.3s;
		margin-right: 10px;
		flex-shrink: 0;
		&._collapse {
			margin-right: 0;
			width: 0;
		}
	}
	.user {
		width: calc(100% - 310px);
		flex: 1;
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
