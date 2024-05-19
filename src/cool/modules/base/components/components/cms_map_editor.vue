<template>
	<el-row v-for="(item, index) in value" :gutter="8">
		<el-col v-if="type === 'map'" :span="6">
			<el-input size="small" v-model="value[index].key" placeholder="键" />
		</el-col>
		<el-col :span="12">
			<el-input size="small" v-model="value[index].value" placeholder="值" />
		</el-col>
		<el-col :span="6">
			<el-button
				v-if="index === 0"
				type="text"
				size="small"
				icon="el-icon-plus"
				@click="addItem"
			/>
			<el-button type="text" size="small" icon="el-icon-delete" @click="deleteItem(index)" />
		</el-col>
	</el-row>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
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
			const obj = JSON.parse(props.modelValue);
			value.value = [];
			for (let key in obj) {
				value.value.push({ key: key, value: obj[key] });
			}
		} catch (e) {}
		if (value.value.length === 0) {
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
				let obj = {};
				for (let i = 0; i < value.value.length; i++) {
					obj[value.value[i].key] = value.value[i].value;
				}
				console.log(obj);
				emit("update:modelValue", JSON.stringify(obj));
			},
			{ deep: true }
		);

		return { value, addItem, deleteItem, type };
	}
});
</script>
