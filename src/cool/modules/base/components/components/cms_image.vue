<template>
	<el-image :fit="props.fit"
			  :hide-on-click-modal="true"
			  :lazy="true"
			  :src="modelValue[0]"
			  :style="props.style"
			  :preview-src-list="modelValue"/>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
	name: "cms-image",
	props: {
		modelValue: {
			type: String,
			default: () => ""
		},
		fit: {
			type: String,
			default: () => "contain"
		},
		style: {
			type: Object,
			default: () => {
				return {
					"width": "30px",
					"height": "30px"
				}
			}
		}
	},

	setup(props, {emit}) {
		let modelValue = ref<String[]>([])

		modelValue.value = props.modelValue.split(",").filter(Boolean)

		return {props, modelValue};
	}
});
</script>
