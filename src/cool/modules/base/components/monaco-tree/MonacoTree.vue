<template>
  <div class="fill" ref="container" id="tree" />
</template>

<script>
import { createController } from "./monaco-controller";
import { Tree } from "./monaco-utils";
import { onBeforeUnmount, onMounted, watch, ref, unref, toRaw, reactive } from 'vue';

export default {
  name: 'monaco-tree-editor',

  props: ['directory','treeConfig','getActions'],

  setup(props, {emit}) {
    const container = ref(null);
    let tree = reactive(null);

    const ensureTree = () => {
      if (unref(container).lastChild) {
        unref(container).removeChild(unref(container).lastChild);
      }

      const treeConfig = toRaw(props.treeConfig);
      const getActions = toRaw(props.getActions);

      treeConfig.controller = createController(document.getElementById('tree'), getActions, true),

      tree = new Tree(container.value, treeConfig);
    };

    const expandTree = (tree) => {
      const model = toRaw(tree).model;
      const elements = [];

      let item;
      const nav = model.getNavigator();

      while (item = nav.next()) {
        elements.push(item);
      }

      for (let i = 0, len = elements.length; i < len; i++) {
        model.expand(elements[i]);
      }
    };


    const onLayout = () => {
      toRaw(tree).layout();
    };

    onMounted(() => {
      ensureTree();

      const rawDirectory = toRaw(props.directory);

      toRaw(tree).model.setInput(rawDirectory);
      toRaw(tree).model.onDidSelect((e) => {
        if (e.selection.length) {
          emit('on-click-file', e.selection[0]);
        }
      });

      document.addEventListener("layout", onLayout);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("layout", onLayout);
    });


    watch(props.directory, (newDirectory, oldDirectory) => {
      if (newDirectory !== oldDirectory) {
        toRaw(tree).model.setInput(newDirectory);
      } else {
        toRaw(tree).model.refresh();
        expandTree(toRaw(tree));
      }
    });

    return {
      tree,
      container,
    }

  },
}
</script>
