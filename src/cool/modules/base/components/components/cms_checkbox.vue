<template>
	<el-checkbox-group v-model="checkList" size="mini" @change="changeVal">
		<el-checkbox v-for="item in props.options" :key="item.key + item.label" :label="item.key"
			>{{ item.label }}
		</el-checkbox>
	</el-checkbox-group>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from "vue";

export default defineComponent({
	name: "cms-checkbox",
	props: {
		modelValue: {
			type: String,
			default: () => ""
		},
		options: {
			type: Array,
			default: () => []
		}
	},
	emits: ["update:modelValue"],

	setup(props, { emit }) {
		let checkList = ref<String[]>([]);

		watch(
			() => props.modelValue,
			() => {
				try {
					checkList.value = props.modelValue.split(",").filter(Boolean);
				} catch (e) {
					checkList.value = [];
				}
			}
		);

		function changeVal(val: String[]) {
			val = val.filter(Boolean);
			emit("update:modelValue", val.join(","));
		}

		try {
			checkList.value = props.modelValue.split(",").filter(Boolean);
		} catch (e) {
			checkList.value = [];
		}

		return { checkList, props, changeVal };
	}
});
</script>
