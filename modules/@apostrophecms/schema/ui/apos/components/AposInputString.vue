<template>
  <AposInputWrapper
    :modifiers="modifiers" :field="field"
    :error="effectiveError" :uid="uid"
    :display-options="displayOptions"
  >
    <template #body>
      <div class="apos-input-wrapper">
        <textarea
          :class="classes"
          v-if="field.textarea && field.type === 'string'" rows="5"
          v-model="next" :placeholder="$t(field.placeholder)"
          @keydown.enter="enterEmit"
          :disabled="field.readOnly" :required="field.required"
          :id="uid" :tabindex="tabindex"
        />
        <input
          v-else :class="classes"
          v-model="next" :type="type"
          :placeholder="$t(field.placeholder)"
          @keydown.enter="enterEmit"
          :disabled="field.readOnly || field.disabled"
          :required="field.required"
          :id="uid" :tabindex="tabindex"
          :step="step"
        >
        <component
          v-if="icon"
          :size="iconSize"
          class="apos-input-icon"
          :is="icon"
        />
      </div>
    </template>
  </AposInputWrapper>
</template>

<script>
import AposInputMixin from 'Modules/@apostrophecms/schema/mixins/AposInputMixin';

export default {
  name: 'AposInputString',
  mixins: [ AposInputMixin ],
  emits: [ 'return' ],
  data () {
    return {
      step: undefined,
      wasPopulated: false
    };
  },
  computed: {
    tabindex () {
      return this.field.disableFocus ? '-1' : '0';
    },
    type () {
      if (this.field.type) {
        if (this.field.type === 'float' || this.field.type === 'integer') {
          return 'number';
        }
        if (this.field.type === 'string' || this.field.type === 'slug') {
          return 'text';
        }
        return this.field.type;
      } else {
        return 'text';
      }
    },
    classes () {
      return [ 'apos-input', `apos-input--${this.type}` ];
    },
    icon () {
      if (this.error) {
        return 'circle-medium-icon';
      } else if (this.field.icon) {
        return this.field.icon;
      } else {
        return null;
      }
    }
  },
  watch: {
    followingValues: {
      // We may be following multiple fields, like firstName and lastName,
      // or none at all, depending
      deep: true,
      handler(newValue, oldValue) {
        // Follow the value of the other field(s), but only if our
        // previous value matched the previous value of the other field(s)
        oldValue = Object.values(oldValue).join(' ').trim();
        newValue = Object.values(newValue).join(' ').trim();
        if ((!this.wasPopulated && ((this.next == null) || (!this.next.length))) || (this.next === oldValue)) {
          this.next = newValue;
        }
      }
    },
    next() {
      if (this.next && this.next.length) {
        this.wasPopulated = true;
      }
    }
  },
  mounted() {
    this.defineStep();
    this.wasPopulated = this.next && this.next.length;
  },
  methods: {
    enterEmit() {
      if (this.field.enterSubmittable) {
        // Include the validated results in cases where an Enter keydown should
        // act as submitting a form.
        this.$emit('return', {
          data: this.next,
          error: this.validate(this.next)
        });
      } else {
        this.$emit('return');
      }
    },
    validate(value) {
      if (value == null) {
        value = '';
      }
      if (typeof value === 'string' && !value.length) {
        // Also correct for float and integer because Vue coerces
        // number fields to either a number or the empty string
        if (this.field.required) {
          return 'required';
        } else {
          return false;
        }
      }
      const minMaxFields = [
        'integer',
        'float',
        'string',
        'date',
        'password'
      ];

      if (this.field.min && minMaxFields.includes(this.field.type)) {
        if ((value != null) && value.length && (this.minMaxComparable(value) < this.field.min)) {
          return 'min';
        }
      }
      if (this.field.max && minMaxFields.includes(this.field.type)) {
        if ((value != null) && value.length && (this.minMaxComparable(value) > this.field.max)) {
          return 'max';
        }
      }
      if (this.field.type === 'email' && value) {
        // regex source: https://emailregex.com/
        const matches = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!matches) {
          return 'invalid';
        }
      }
      return false;
    },
    defineStep() {
      if (this.type === 'number') {
        this.step = this.field.type === 'float' ? 'any' : 1;
      }
    },
    convert(s) {
      if (this.field.type === 'integer') {
        if ((s == null) || (s === '')) {
          return s;
        } else {
          return parseInt(s);
        }
      } else if (this.field.type === 'float') {
        if ((s == null) || (s === '')) {
          return s;
        } else {
          // The native parse float converts 3.0 to 3 and makes
          // next to become integer. In theory we don't need parseFloat
          // as the value is natively guarded by the browser 'number' type.
          // However we need a float value sent to the backend
          // and we force that when focus is lost.
          if (this.focus && `${s}`.match(/\.[0]*$/)) {
            return s;
          }
          return parseFloat(s);
        }
      } else {
        if (s == null) {
          return '';
        } else {
          return s.toString();
        }
      }
    },
    minMaxComparable(s) {
      const converted = this.convert(s);
      if ((this.field.type === 'integer') || (this.field.type === 'float') || (this.field.type === 'date') || (this.field.type === 'range') || (this.field.type === 'time')) {
        // Compare the actual values for these types
        return converted;
      } else {
        // Compare the length for other types, like string or password or url
        return converted.length;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .apos-input--date,
  .apos-input--time {
    // lame magic number ..
    // height of date/time input is slightly larger than others due to the browser spinner ui
    height: 46px;
    padding-right: 40px;
  }
  .apos-input--date {
    &::-webkit-clear-button {
      position: relative;
      right: 5px;
    }
  }

  .apos-field--small .apos-input--date,
  .apos-field--small .apos-input--time {
    height: 33px;
  }
</style>
