<template>
	<div class="login-captcha" @click="refresh">
		<div v-if="svg" class="svg" v-html="svg"></div>
		<img v-else class="base64" :src="base64" alt="" />
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
	emits: ["update:modelValue", "change"],

	setup(_, { emit }) {
		const base64 = ref("");
		const svg = ref("");
		const service = inject<any>("service");

		const refresh = () => {
			service.common
				.captcha({
					height: 36,
					width: 110
				})
				.then(({ captchaId, data }: any) => {
					if (data.includes(";base64,")) {
						base64.value = data;
					} else {
						svg.value = data;
					}

					emit("update:modelValue", captchaId);
					emit("change", {
						base64,
						svg,
						captchaId
					});
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		};

		refresh();

		return {
			base64,
			svg,
			refresh
		};
	}
});
</script>

<style lang="scss" scoped>
.login-captcha {
	height: 34px;
	position: absolute;
	top: 1px;
	right: 1px;

	cursor: pointer;

	.svg {
		height: 100%;
	}

	.base64 {
		border-radius: 3px;
		height: 100%;
	}
}
</style>
