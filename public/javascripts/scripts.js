//MODEL -- CONTACT
var ContactModel = Backbone.Model.extend({
	
	urlRoot: "/contacts",

	defaults: {
		name: "",
		age: 0,
		address: "",
		phone_number: "",
		picture: "",
		category_id: 1,
		email: ""
	}

});

//I DON'T KNOW HOW TO USE COLLECTIONS
//COLLECTION -- for different Categories
var FriendsCollection = Backbone.Collection.extend({
	url: "/categories/1",
	model: ContactModel
})

var FrenemiesCollection = Backbone.Collection.extend({
	url: "/categories/2",
	model: ContactModel,
})

var friends = new FriendsCollection();
var frenemies = new FrenemiesCollection();
// // var work = new CategoryCollection();

var ContactView = Backbone.View.extend({
	
	tagName: "li",

	template: _.template( $("#template").html() ),

	events: {
		"click button.view" :"viewContact",
		"click button.edit"	:"editContact",
		"click button.delete" :"deleteContact"
	},

	viewContact: function(){
		console.log('to toggle view of contact')
	},

	editContact: function(){
		console.log('to toggle edit of contact')
	},

	deleteContact: function(){
		console.log('to delete contact')
	},

	initialize: function(){
		console.log('ContactView Initialized')
		
		//not sure what this does yet...i think the collection is listening for changes in these models

		// this.listenTo(this.model, "change", this.render);
		// this.listenTo(this.model, "destroy remove", this.remove);
		
		this.render()//this is to render the dom element

		},

	render: function(){
		console.log(this.template)
		this.$el.html( this.template(this.model.attributes) );
	}

})


//I REALLY DON'T GET THIS
var FriendsView = Backbone.View.extend({
	initialize: function(){
		// this.listenTo(this.friends, "add", this.addOne);
		console.log(this.collection)
		friends.fetch()
		console.log(this)
	},
	render: function(){
		console.log(this)
	}
  //what is this doing?
  // addOne: function(item) {
  //   var view = new ItemView({model: item});
  //   view.render();
  //   this.$el.append(view.el);
  // }

});


///// BUILDING MY VIEWS 

var friendList = new FriendsView({collection: friends, el: $('ul.friends') });

friendList.render()










