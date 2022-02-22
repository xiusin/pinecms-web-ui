<template>
	<el-checkbox-group v-model="checkList" size="mini" @change="changeVal">
		<el-checkbox v-for="item in props.options" :key="item.key + item.label" :label="item.key"
			>{{ item.label }}
		</el-checkbox>
	</el-checkbox-group>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

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
		console.log("cms_checkbox", props);

		const checkList = ref([]);
		try {
			checkList.value = props.modelValue.filter(Boolean).split(",");
		} catch (e) {
			checkList.value = [];
		}

		function changeVal(val) {
			val = val.filter(Boolean);
			emit("update:modelValue", val.join(","));
		}

		return { checkList, props, changeVal };
	}
});
</script>
