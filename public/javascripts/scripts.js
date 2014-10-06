//**MODEL**----------------------------------------------

var ContactModel = Backbone.Model.extend({
	
	initialize: function(){
		console.log('contact model Initialized')
	},

	urlRoot: "/contacts",

	defaults: {
		name: "",
		email: "",
		address: "",
		phone_number: "",
		picture: "",
		category_id: 1
	}

});


//**COLLECTION**-----------------------------------------


var ContactCollection = Backbone.Collection.extend({
	
	model: ContactModel,
	url: '/contacts',
	
	initialize: function(category_id){
		console.log("contact collection Initialized")
		this.category_id = category_id
		//i want this collection to listen to changes to my Contact Model cat_id to switch from collection to collection
		this.on("change:category_id", this.updateCat)
	
	},

	parse: function(response){

		var filtered = _.where(response, {category_id: this.category_id})
		return filtered		

	},

	updateCat: function(){
		this.fetch()
		console.log('contact updated')
	}

})


var friendsCollection = new ContactCollection(1)
var frenemiesCollection = new ContactCollection(2)


//**VIEWS**----------------------------------------------

var ContactView = Backbone.View.extend({
	
	tagName: "li",

	template: _.template( $("#template").html() ),

	events: {
		"click button.view" :"viewContact",
		"click button.edit"	:"editContact",
		"click button.delete" :"deleteContact",
		"click button.update" :"updateContact"
	},

	viewContact: function(){
		this.$el.find('.view-details').toggle()
	},

	editContact: function(){
		this.$el.find('.edit-details').toggle()
	},

	deleteContact: function(){
		this.model.destroy()
	},

	updateContact: function(){
		this.model.set({
			name: this.$el.find('input.nameUpdate').val(),
			category_id: this.$el.find('input.categoryUpdate').val()
		})
		this.model.save()

	},

	initialize: function(){
		console.log('ContactView Initialized')

		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "destroy remove", this.remove);

		},

	render: function(){
		this.$el.html( this.template(this.model.attributes) );
	}

})


//**

var ListView = Backbone.View.extend({
	
	initialize: function(){
		console.log('list view Initialized')
		this.listenTo(this.collection, 'add', this.addOne)
		this.collection.fetch()
	},

	addOne: function(contact){
		var contactView = new ContactView({model: contact})
		contactView.render();
		this.$el.append(contactView.el)
	},

})

var friendsView = new ListView({collection: friendsCollection, el: $('ul.friends')})

var frenemiesView = new ListView({collection: frenemiesCollection, el:$('ul.frenemies')})


//**

var FormView = Backbone.View.extend({

	events: {
		"click button.add" : "create"
	},

	create: function(){
		var name = this.$el.find('input.name').val();
		var email = this.$el.find('input.email').val();
		var address = this.$el.find('input.address').val();
		var phone = this.$el.find('input.phone').val();
		var picture = this.$el.find('input.picture').val();
		var category = this.$el.find('select.category').val();
 	
		if (name == "" || email == ""){
			alert('missing field')
		}else if(category == 'Friends'){
			this.collection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 1})
		}else{
			console.log('nothing happened')
		}

		this.$el.find('input').val("")

	}

});


var formView = new FormView({el: $('.form'), collection: friendsCollection})





