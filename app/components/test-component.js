import Ember from 'ember';

export default Ember.Component.extend({
  name: "Jonathan",
  cname: Ember.computed("name", function(){
    return this.get('name') + " is the best!";
    })
});
