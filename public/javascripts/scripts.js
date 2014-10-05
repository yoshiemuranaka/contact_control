//**MODEL**------------------------------------------------

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

var CategoryModel = Backbone.Model.extend({

	urlRoot: '/categories',

	initialize: function(category_id){
		console.log('category model initialized')
		var collection = this.set({id: category_id, contacts: new ContactCollection()})
		collection.fetch()
		return collection
	}

});



//**COLLECTION**------------------------------------------

var ContactCollection = Backbone.Collection.extend({
	
	model: ContactModel,
	url: '/contacts',

})

var CategoryCollection = Backbone.Collection.extend({

	url: '/categories',
	model: CategoryModel

})

// var allContacts = new ContactCollection()

// var friendsCollection = new CategoryCollection({id: 1})
// var frenemiesCollection = new CategoryCollection({id: 2})

var friendsModel = new CategoryModel(1)
var frenemiesModel = new CategoryModel(2)

var friendsCollection = new CategoryCollection({model: friendsModel})




//**VIEWS**------------------------------------------------

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
		
		this.render()

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

// var contactsView = new ListView({collection: allContacts, el: $('ul.friends')})

var friendsView = new ListView({collection: friendsCollection, el: $('ul.friends')})

//**


var FormView = Backbone.View.extend({
	
	initialize: function(){
		var friendsCollection = friendsCollection
		var frenemiesCollection = frenemiesCollection
	},

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
 	

		if (category == 'Friends'){
			friendsCollection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 1})
		}else{
			console.log('im here')
		}



		// if (this.$el('input.name').val()== ""){
		// 	alert('missing field')
		//i am filtering my input here to create new collection instances for the specified collection
	// 	 if (category == 'Friends'){
	// 		this.collection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 1})
	// 	// }else if (category == 'Family')
	// 	}else{
	// 		console.log('im here')
	// 	};
	// 	$('input').val("")
	}

});

// var formView = new FormView({ el: $('.form'), collection: allContacts})

var formView = new FormView({el: $('.form')})





