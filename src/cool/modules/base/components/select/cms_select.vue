<template>
	<el-select
		:filterable="props.filterable"
		:placeholder="props.placeholder"
		:multiple="props.multiple"
		:multipleLimit="props.multipleLimit"
		:automatic-dropdown="true"
		:size="props.size"
		v-model="value"
		@change="changeValue"
	>
		<el-option
			v-for="(item, idx) in optionArr"
			:key="idx + '-' + (item.value ?? item.id)"
			:value="item.value ?? item.id"
			:label="item.label ?? item.name ?? ''"
		/>
	</el-select>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";

export default defineComponent({
	name: "cms-select",

	props: {
		multiple: {
			type: Boolean,
			default: false
		},
		collapseTags: {
			type: Boolean,
			default: false
		},
		filterable: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default: "请选择"
		},
		multipleLimit: {
			type: Number,
			default: 10
		},
		service: {
			type: Object,
			default: null
		},
		size: {
			type: String,
			default: "mini"
		},
		autocomplete: {
			type: String,
			default: "off"
		},
		options: {
			type: Array
		},
		modelValue: {
			type: Object,
			default: () => null
		}
	},
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		const remoteMethod = (query: string) => {
			if (query !== "") {
			}
		};
		let defaultValue: any = "";
		const value = ref(props.modelValue);
		if (typeof value.value === "number") {
			defaultValue = 0;
		}
		const optionArr = ref([{ label: props.placeholder, value: defaultValue }]);
		watch(
			() => props.modelValue,
			(val) => (value.value = val)
		);

		if (props.service) {
			onMounted(async () => {
				optionArr.value = await props.service.select();
				optionArr.value.unshift({ label: props.placeholder, value: defaultValue });
			});
		}
		function changeValue(value: any) {
			emit("update:modelValue", value);
		}
		return {
			props,
			remoteMethod,
			optionArr,
			changeValue,
			value
		};
	}
});
</script>
