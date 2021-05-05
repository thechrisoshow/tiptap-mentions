<template>
  <ul
    class="bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
  >
    <li
      :class="[
        index === selectedIndex ? 'text-white bg-indigo-600' : 'text-gray-900',
        'cursor-default select-none relative py-2 pl-3 pr-9'
      ]"
      v-for="(commenter, index) in items"
      :key="commenter.id"
      :value="commenter.id"
      @click="selectItem(index)"
    >
      <div class="flex items-center">
        <img
          :src="commenter.image"
          alt=""
          class="flex-shrink-0 h-6 w-6 rounded-full"
        />
        <span
          :class="[
            index === selectedIndex ? 'font-semibold' : 'font-normal',
            'ml-3 block truncate'
          ]"
        >
          {{ commenter.name }}
        </span>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true
    },

    command: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      selectedIndex: 0
    };
  },

  methods: {
    onKeyDown({ event }: { event: any }): boolean {
      if (event.key === "ArrowUp") {
        this.upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        this.downHandler();
        return true;
      }

      if (event.key === "Enter") {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler(): void {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length;
    },

    downHandler(): void {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },

    enterHandler(): void {
      this.selectItem(this.selectedIndex);
    },

    selectItem(index: number): void {
      const item = this.items[index];

      if (item) {
        this.command(item);
      }
    }
  }
});
</script>
