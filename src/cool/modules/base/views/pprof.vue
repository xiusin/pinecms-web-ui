<template>
	<iframe style="width: 100%; height: 100%; background-color: #fff; padding: 10px;" :src="url" frameborder="0" id="pprofIframe"> </iframe>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
	name: "sys-pprof",
	setup() {
		const url = ref("");

		const service = inject<any>("service");

		onMounted(() => {
			service.common.pprof().then((data: any) => {
				url.value = data;
			});
		});

		return {
			url
		};
	}
});
</script>
