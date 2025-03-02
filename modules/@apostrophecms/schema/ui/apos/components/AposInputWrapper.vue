<template>
  <div class="apos-field__wrapper">
    <component :is="wrapEl" :class="classList">
      <div class="apos-field__info">
        <component
          v-if="field.label" :class="{'apos-sr-only': field.hideLabel }"
          class="apos-field__label"
          :is="labelEl" :for="uid"
        >
          {{ $t(label) }}
          <span v-if="field.required" class="apos-field__required">
            *
          </span>
          <span
            v-if="(field.help || field.htmlHelp) && displayOptions.helpTooltip"
            class="apos-field__help-tooltip"
          >
            <AposIndicator
              icon="help-circle-icon"
              class="apos-field__help-tooltip__icon"
              :tooltip="field.help || field.htmlHelp"
              :icon-size="11"
              icon-color="var(--a-base-4)"
            />
          </span>
          <span v-if="displayOptions.changed" class="apos-field__changed">
            <AposLabel
              label="apostrophe:changed" class="apos-field__changed__label"
              :modifiers="[ 'apos-is-warning', 'apos-is-filled' ]"
              tooltip="apostrophe:fieldHasUnpublishedChanges"
            />
          </span>
        </component>
        <!-- eslint-disable vue/no-v-html -->
        <p
          v-if="(field.help || field.htmlHelp) && !displayOptions.helpTooltip"
          class="apos-field__help"
          v-html="$t(field.help || field.htmlHelp)"
        />
        <!-- eslint-enable vue/no-v-html -->
        <slot name="additional" />
      </div>
      <slot name="body" />
      <div v-if="errorMessage" class="apos-field__error">
        {{ $t(errorMessage) }}
      </div>
    </component>
    <!-- CSS Escape hatch for additional interfaces like relatipnship managers -->
    <slot name="secondary" />
  </div>
</template>

<script>
// A component designed to be used as a scaffold for AposInputString and
// friends, which override the `body` slot
export default {
  name: 'AposInputWrapper',
  inject: {
    originalDoc: {
      default: () => ({
        ref: null
      })
    }
  },
  props: {
    field: {
      type: Object,
      required: true
    },
    error: {
      type: [ String, Boolean, Object ],
      default: null
    },
    uid: {
      type: Number,
      required: true
    },
    modifiers: {
      type: Array,
      default() {
        return [];
      }
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    displayOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      wrapEl: 'div',
      labelEl: 'label'
    };
  },
  computed: {
    label () {
      const { label, publishedLabel } = this.field;

      if (
        this.originalDoc.ref &&
        this.originalDoc.ref.lastPublishedAt &&
        publishedLabel
      ) {
        return publishedLabel;
      }

      return label;
    },
    classList: function () {
      const classes = [
        'apos-field',
        `apos-field--${this.field.type}`,
        `apos-field--${this.field.name}`
      ];
      if (this.field.classes) {
        classes.push(this.field.classes);
      }
      if (this.errorClasses) {
        classes.push(this.errorClasses);
      }
      if (this.modifiers) {
        this.modifiers.forEach((m) => {
          classes.push(`apos-field--${m}`);
        });
      }
      return classes;
    },
    errorClasses: function () {
      if (!this.error) {
        return null;
      }

      let error = 'unknown';

      if (typeof this.error === 'string') {
        error = this.error;
      } else if (this.error.name) {
        error = this.error.name;
      }

      return `apos-field--error apos-field--error-${error}`;
    },
    errorMessage () {
      if (this.error) {
        if (typeof this.error === 'string') {
          return this.error;
        } else if (this.error.message) {
          return this.error.message;
        } else {
          return 'Error';
        }
      } else {
        return false;
      }
    }
  },
  mounted: function () {
    if (this.field.type === 'radio' || this.field.type === 'checkbox') {
      this.wrapEl = 'fieldset';
      this.labelEl = 'legend';
    }
  }
};
</script>

<style lang="scss" scoped>
.apos-field__wrapper {
  position: relative;
}

.apos-field {
  border-width: 0;
  padding: 0;
  [disable]:hover, [disabled] ~ .apos-choice-label-text:hover {
    cursor: not-allowed;
  }
}

.apos-field--text {
  @include type-base;
}

.apos-field__label {
  @include type-label;
  display: block;
  margin: 0 0 $spacing-base;
  padding: 0;
  color: var(--a-text-primary);
}

.apos-field__help {
  margin: 0 0 $spacing-base;
  @include type-base;
  line-height: var(--a-line-tall);
  color: var(--a-base-3);
}

.apos-field__help-tooltip__icon {
  position: relative;
}

.apos-field__changed {
  position: relative;
  margin-left: $spacing-half;
  top: -2px;
}

.apos-field__error {
  @include type-help;
  margin: $spacing-base 0;
  color: var(--a-danger);
}

.apos-field__required {
  color: var(--a-danger);
}

.apos-field__help-tooltip {
  position: relative;
  top: 2px;
}

.apos-field--inline {
  display: flex;
  align-items: center;
  .apos-field__label {
    margin-bottom: 0;
  }
  .apos-field__info,
  .apos-input-wrapper {
    width: 48%;
  }
  .apos-field__info {
    margin-right: 4%;
  }
  &.apos-field--range {
    display: block;
    .apos-range__input {
      margin: 5px 0 0;
    }
    .apos-range__scale {
      margin-top: 0;
    }
    .apos-range__value {
      padding-top: 9px;
    }
    .apos-field__info {
      margin: 0 0 5px;
    }
    .apos-field__info,
    .apos-input-wrapper {
      width: 100%;
    }
  }
}

</style>
