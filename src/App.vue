<template>
  <CommentList />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CommentList from "@/components/CommentList.vue";

export default defineComponent({
  name: "App",
  components: {
    CommentList
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
