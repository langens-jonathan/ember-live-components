import Ember from 'ember';

export default Ember.Component.extend({
    components: [],

    active: undefined,

    newname: "",

    hasActive: Ember.computed('active', function(){
	this.get('active') !== undefined;
    }),

    didInsertElement: function()
    {
    	    $.ajax({
    		url: '/components',
    		type: 'GET',
    		contentType: "application/json",
    		success: (data) => {
    		    data = JSON.parse(data);
		    data.data.map(function(item,index)
			     {
				 item.code = decodeURIComponent(item.code);
				 item.template = decodeURIComponent(item.template);
				 return item;
			     });
    		    this.set('components', data.data);
    		},
    		error: function() {
    		}
    	    });
    },

    actions:{
	selectComponent: function(name){
	    this.get('components').forEach( (item, index) =>
					    {
						if(item.name === name)
						{
						    this.set('active', item);
						}
					    });
	},
	saveComponent: function(component){
	    // do the calls
	    var code=encodeURIComponent(component.code);
	    var template=encodeURIComponent(component.template);
	    
	    $.ajax({
		url: '/components',
		type: 'POST',
		data: JSON.stringify({"name": component.name, "code" : code, "template": template}),
		contentType: "application/json",
		success: (data) => {
		    Ember.Logger.log("saved component");
		    Ember.Logger.log(data);
		},
		error: function() {
		}
	    });
	},

	newComponent: function()
	{
	    var nc = {};
	    nc.name = this.get('newname');
	    nc.template = "";
	    nc.code = "import Ember from 'ember'; export default Ember.Component.extend({});";
	    this.actions.saveComponent(nc);
	},
	
    }

});
