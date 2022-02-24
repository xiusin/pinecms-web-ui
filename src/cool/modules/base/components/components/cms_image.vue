<template>
		<el-image v-for="(item, index) in srcList.slice(0,3)" :fit="props.fit" style="margin-right: 3px"
				  :hide-on-click-modal="true"
				  :lazy="true"
				  :src="item"
				  :initial-index="index"
				  :style="props.style"
				  :preview-src-list="srcList">
			<div slot="error" class="image-slot">
				<i class="el-icon-picture-outline"></i>
			</div>
		</el-image>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

/**
 * 列表内图片渲染组件, 多图最多展示三个
 */
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

	setup(props) {
		let srcList = ref<String[]>([])

		srcList.value = props.modelValue.split(",").filter(Boolean)

		return {props, srcList};
	}
});
</script>
