<template>
	<el-cascader v-model="value" :props="props" />
</template>

<script lang="ts">
import {defineComponent, inject, ref, watch} from "vue";

export default defineComponent({
	name: "cms-city",
	props: {
		modelValue: {type: String, default: () => ""},
		multiple: {type: Boolean, default: () => false},
		lazy: {type: Boolean, default: () => false},
	},
	emits: ["update:modelValue"],

	setup(props, {emit}) {
		const value = ref<String>('')
		const service = inject<any>("service");

		watch(() => value.value, () => emit("update:modelValue", value));
		const oProps = {
			multiple: props.multiple,
			lazy: props.lazy,
			lazyLoad: (node: { id: any; }, resolve: any) => {
				const {id} = node
				service.system.district.select({"parent_id": id}).then((data: any) => {
					resolve(data)
				})
			}
		}
		return {value, oProps};
	}
});
</script>
