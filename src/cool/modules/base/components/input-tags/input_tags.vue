<template>
	<div>
		<el-tag
			v-for="(tag, index) in dynamicTags"
			:key="index"
			closable
			:disable-transitions="false"
			@click="editTag(tag, index)"
			@close="handleClose(tag)"
		>
			<span v-if="index != num">{{ tag }}</span>
			<input
				class="custom_input"
				type="text"
				v-model="words"
				v-if="index == num"
				ref="editInput"
				@keyup.enter.native="handleInput(tag, index)"
				@blur="handleInput(tag, index)"
			/>
		</el-tag>
		<el-input
			class="input-new-tag"
			v-if="inputVisible"
			v-model="inputValue"
			ref="saveTagInput"
			size="small"
			@keyup.enter.native="handleInputConfirm"
			@blur="handleInputConfirm"
		/>
		<el-button v-else class="button-new-tag" size="mini" @click="showInput"
			>{{ theme }}
		</el-button>
	</div>
</template>

<script>
export default {
	name: "input-tags",
	props: {
		// 表单值
		modelValue: {
			type: String,
			default: () => {
				return "";
			}
		},
		theme: {
			type: String,
			default: "+ 新标签"
		}
	},
	data() {
		return {
			inputVisible: false,
			inputValue: "",
			num: -1,
			words: "",
			tagList: []
		};
	},
	computed: {
		dynamicTags: {
			get() {
				return this.tagList;
			},
			set(tagList) {
				this.$emit("update:modelValue", tagList.join(","));
			}
		}
	},
	watch: {
		modelValue: {
			handler(val) {
				console.log(val);
				this.tagList = val.split(",").filter(Boolean);
			}
		}
	},
	methods: {
		// 数组去重
		unique(arr) {
			let x = new Set(arr);
			return [...x];
		},
		handleClose(tag) {
			this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.dynamicTags.push(inputValue);
			}
			this.dynamicTags = this.unique(this.dynamicTags);
			this.inputVisible = false;
			this.inputValue = "";
		},
		editTag(tag, index) {
			this.num = index;
			this.$nextTick(() => {
				this.$refs.editInput[0].focus();
			});
			this.words = tag;
		},
		handleInput(tag, index) {
			let words = this.words;
			if (words) {
				this.dynamicTags[index] = words;
			}
			this.dynamicTags = this.unique(this.dynamicTags);
			this.words = "";
			this.num = -1;
		}
	}
};
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
	margin-left: 10px;
}

.button-new-tag {
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.el-tag + .button-new-tag {
	margin-left: 10px;
}

.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}

.custom_input {
	width: 80px;
	height: 16px;
	outline: none;
	border: transparent;
	background-color: transparent;
	font-size: 12px;
	color: #b59059;
}
</style>
