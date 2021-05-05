<template>
  <editor-content :editor="editor" />
</template>

<script lang="ts">
// Icons come from https://remixicon.com/
import tippy from "tippy.js";
import { computed, defineComponent, PropType, ref } from "vue";
import { useEditor, EditorContent, VueRenderer } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import Mention from "@/components/BaseMention.ts";
import MentionList from "@/components/BaseMentionList.vue";

import { Commenter } from "@/types";

export default defineComponent({
  setup(props, context) {
    let rawHtml = ref("");
    const mentioned = computed(() => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(rawHtml.value, "text/html");
      const mentionElements = htmlDoc.querySelectorAll("[data-mention-id]");

      const commenterIds = Array.from(mentionElements).map((el) =>
        el.getAttribute("data-mention-id")
      );
      return props.commenters.filter((commenter) =>
        commenterIds.includes(commenter.id.toString())
      );
    });
    const editor = useEditor({
      editorProps: {
        attributes: {
          class: "prose prose-sm block w-full"
        }
      },

      onUpdate: ({ editor }) => {
        rawHtml.value = editor.getHTML();
        context.emit("update:content", rawHtml);
      },

      extensions: [
        Document,
        Paragraph,
        Placeholder.configure({
          placeholder: "Add a comment"
        }),
        Text,
        Mention.configure({
          HTMLAttributes: {
            class: "bg-indigo-100 text-indigo-500 p-1 rounded"
          },

          suggestion: {
            items: (query) => {
              return props.commenters.filter(
                (commenter) =>
                  commenter.name
                    .toLowerCase()
                    .startsWith(query.toLowerCase()) &&
                  !mentioned.value.includes(commenter)
              );
            },

            render: () => {
              let component: VueRenderer;
              let popup: any;
              let ed: any;

              return {
                onStart: (props) => {
                  ed = editor;
                  component = new VueRenderer(MentionList, {
                    editor: editor.value!,
                    props
                  });

                  popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start"
                  });
                },

                onUpdate(props) {
                  component.updateProps(props);

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect
                  });
                },

                onKeyDown(props) {
                  return component.ref?.onKeyDown(props);
                },

                onExit() {
                  popup[0].destroy();
                  component.destroy();
                }
              };
            }
          }
        })
      ],
      content: props.content
    });

    return {
      editor,
      mentioned,
      rawHtml
    };
  },

  components: {
    EditorContent
  },

  props: {
    commenters: {
      type: Array as PropType<Commenter[]>,
      required: true
    },

    content: {
      type: String,
      default: ""
    }
  },

  methods: {
    focus() {
      this.editor!.chain().focus();
    }
  },

  watch: {
    content(value) {
      const isSame = this.editor!.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor!.commands.setContent(this.content, false);
    },

    mentioned(value) {
      this.$emit("update:mentioned", value);
    }
  }
});
</script>

<style lang="scss">
.ProseMirror {
  @apply bg-white cursor-text px-4 py-2 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md;
}

button.is-active {
  @apply bg-gray-200 hover:bg-gray-200;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
  width: 100%;
}
</style>
