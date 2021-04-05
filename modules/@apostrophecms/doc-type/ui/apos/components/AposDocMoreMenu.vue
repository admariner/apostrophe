<template>
  <AposContextMenu
    class="apos-admin-bar__context-button"
    :menu="menu"
    :disabled="disabled"
    menu-placement="bottom-end"
    @item-clicked="menuHandler"
    :button="{
      tooltip: { content: 'More Options', placement: 'bottom' },
      label: 'More Options',
      icon: 'dots-vertical-icon',
      iconOnly: true,
      type: 'subtle',
      modifiers: ['small', 'no-motion']
    }"
  />
</template>

<script>

export default {
  name: 'AposDocMoreMenu',
  props: {
    isModified: {
      type: Boolean,
      default: false
    },
    isModifiedFromPublished: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    canMoveToTrash: {
      type: Boolean,
      default: false
    },
    canSaveDraft: {
      type: Boolean,
      default: false
    },
    canDiscardDraft: {
      type: Boolean,
      default: false
    },
    canCopy: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const menu = {
      isOpen: false,
      menu: this.recomputeMenu()
    };
    return menu;
  },
  watch: {
    isModified() {
      this.menu = this.recomputeMenu();
    },
    isModifiedFromPublished() {
      this.menu = this.recomputeMenu();
    },
    isPublished() {
      this.menu = this.recomputeMenu();
    }
  },
  methods: {
    menuHandler(action) {
      this.$emit(action);
    },
    recomputeMenu() {
      return [
        // TODO
        // ...(this.isModifiedFromPublished ? [
        //   {
        //     label: 'Share Draft',
        //     action: 'share'
        //   }
        // ] : []),
        // TODO
        // // You can always do this, if you do it with a new item
        // // it just saves and you start a second one
        // {
        //   label: 'Duplicate Document',
        //   action: 'duplicate'
        // },
        ...(this.canMoveToTrash ? [
          {
            label: 'Move to Trash',
            action: 'moveToTrash',
            modifiers: [ 'danger' ]
          }
        ] : []),
        ...(this.canDiscardDraft ? [
          {
            label: this.isPublished ? 'Discard Changes' : 'Discard Draft',
            action: 'discardDraft',
            modifiers: [ 'danger' ]
          }
        ] : []),
        ...(this.canSaveDraft ? [
          {
            label: this.isPublished ? 'Save Draft' : 'Preview Draft',
            action: 'saveDraft'
          }
        ] : []),
        ...(this.canCopy ? [
          {
            label: 'Copy',
            action: 'copy'
          }
        ] : [])
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
