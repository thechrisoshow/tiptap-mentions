<template>
  <div class="px-4 sm:px-6">
    <div class="py-6">
      <ul class="space-y-8">
        <li v-for="comment in comments" :key="comment">
          <div class="flex space-x-3">
            <div class="flex-shrink-0">
              <img
                :src="comment.commenter.image"
                class="h-10 w-10 rounded-full"
              />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ comment.commenter.name }}
              </div>

              <div
                class="mt-1 text-sm text-gray-700"
                v-html="comment.content"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="bg-gray-50 py-6 -mx-5 p-5">
      <div class="flex space-x-3">
        <div class="flex-shrink-0">
          <img class="h-10 w-10 rounded-full" :src="avatar" alt="" />
        </div>
        <div class="min-w-0 flex-1">
          <BaseCommentText
            :commenters="commenters"
            v-model:content="content"
            @update:mentioned="mentioned = $event"
            ref="commentContent"
          />

          <div class="mt-3 flex items-center justify-between">
            <span
              class="invisible sm:visible group inline-flex items-start text-sm space-x-2 text-gray-500 hover:text-gray-900"
            >
              <QuestionMarkCircleIcon
                class="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span> Type @ to mention a team member </span>
            </span>
            <button
              @click="saveComment"
              class="inline-flex items-center px-2.5 py-1.5 rounded border border-transparent text-xs font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { QuestionMarkCircleIcon } from "@heroicons/vue/solid";
import BaseCommentText from "@/components/BaseCommentText.vue";
import Commenters from "@/assets/commenters.json";

import { Comment, Commenter } from "@/types";

export default defineComponent({
  components: {
    BaseCommentText,
    QuestionMarkCircleIcon
  },

  data() {
    return {
      comments: [] as Comment[],
      content: "",
      commenters: Commenters,
      mentioned: []
    };
  },

  computed: {
    avatar(): string {
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
    }
  },

  methods: {
    saveComment() {
      const comment: Comment = {
        commenter: {
          id: 254,
          name: "Chris",
          image: this.avatar
        },
        content: this.content,
        mentionedIds: this.mentioned.map((m: Commenter) => m.id)
      };
      this.comments.push(comment);
      this.content = "";
      // Put code for saving to api here
    }
  }
});
</script>

<style scoped></style>
