<template>
	<el-row v-for="(item, index) in value" :gutter="24">
		<el-col v-if="type === 'map'" :span="6">
			<el-input
				size="mini"
				v-model="value[index].key"
				placeholder="键"
				:suffix-icon="Calendar"
			/>
		</el-col>
		<el-col :span="12">
			<el-input
				size="mini"
				v-model="value[index].value"
				placeholder="值"
				:prefix-icon="Search"
			/>
		</el-col>
		<el-col :span="6">
			<el-button
				v-if="index === 0"
				type="primary"
				size="mini"
				icon="el-icon-plus"
				@click="addItem"
			/>
			<el-button
				type="warning"
				size="mini"
				icon="el-icon-delete"
				@click="deleteItem(index)"
			/>
		</el-col>
	</el-row>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from "vue";
import { Calendar, Search } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";

export default defineComponent({
	name: "cms-map-editor",
	props: {
		modelValue: { type: String, default: () => "" },
		unique: { type: Boolean, default: () => true },
		type: { type: String, default: () => "map" } // map | array
	},
	emits: ["update:modelValue"],

	setup(props, { emit }) {
		const value = ref([{ key: "", value: "" }]);

		const type = ref(props.type);

		try {
			value.value = JSON.parse(props.modelValue);
		} catch (e) {
			value.value = [{ key: "", value: "" }];
		}

		function addItem() {
			for (const key in value.value) {
				if (value.value[key].key === "") {
					ElMessageBox.alert("存在没有设置的key");
					return;
				}
			}
			value.value.push({ key: "", value: "" });
		}

		function deleteItem(index: any) {
			if (value.value.length > 1) {
				value.value.splice(index, 1);
			} else {
				ElMessageBox.alert("最少保留一项");
			}
		}

		watch(
			() => value.value,
			() => {
				emit("update:modelValue", JSON.stringify(value.value));
			}
		);

		return { value, Calendar, Search, addItem, deleteItem, type };
	}
});
</script>
