<template>
	<el-select v-model="value"
			   clearable
			   :automatic-dropdown="true"
			   :filterable="true"
			   size="mini"
			   placeholder="请选择字典分类">
		<el-option
			v-for="(item, index) in options"
			:key="index + '-' + item.value"
			:label="item.label"
			:value="item.value"
		>
		</el-option>
	</el-select>
</template>

<script lang="ts">
import {defineComponent, inject, ref, watch} from "vue";

export default defineComponent({
	name: "cms-dict-category",
	props: {modelValue: {type: String, default: () => ""}},
	emits: ["update:modelValue"],

	setup(props, {emit}) {
		const value = ref<String>('')
		const service = inject<any>("service");
		const options = ref([])
		service.system.dictCategory.select().then((data: any) => {
			options.value = data;
		})
		watch(() => value.value, () => emit("update:modelValue", value));
		return {options, value};
	}
});
</script>
