/*
* Provides prep work for fetching choices from the server
* or defaulting to the choices provided with the field.
*/

export default {
  data() {
    return {
      choices: []
    };
  },

  async mounted() {
    if (typeof this.field.choices === 'string') {
      const action = this.options.action;
      const response = await apos.http.get(
        `${action}/choices`,
        {
          qs: {
            fieldId: this.field._id
          },
          busy: true
        }
      );
      if (response.choices) {
        this.choices = response.choices;
      }
    } else {
      this.choices = this.field.choices;
    }
  }
};
