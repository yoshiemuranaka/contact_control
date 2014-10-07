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
var familyCollection = new ContactCollection(2)
var workCollection = new ContactCollection(3)


//**VIEWS**----------------------------------------------

var ContactView = Backbone.View.extend({
	
	tagName: "li",

	attributes: {
		class: "list-group-item"
	},

	template: _.template( $("#template").html() ),

	events: {
		"click .glyphicon-eye-open" :"viewContact",
		"click .glyphicon-pencil"	:"editContact",
		"click .glyphicon-trash" :"deleteContact",
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
		var name = this.$el.find('input.nameUpdate').val()
		var address = this.$el.find('input.addressUpdate').val()
		var phone = this.$el.find('input.phoneUpdate').val()
		var email = this.$el.find('input.emailUpdate').val()
		var picture = this.$el.find('input.pictureUpdate').val()

		if(name != ""){
			this.model.set({
			name: name
			})
		};

		if(address != ""){
			this.model.set({
			address: address
			})
		};

		if(phone != ""){
			this.model.set({
			phone: phone
			})
		};

		if(email != ""){
			this.model.set({
			email: email
			})
		};

		if(picture != ""){
			this.model.set({
			picture: picture
			})
		};

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

var familyView = new ListView({collection: familyCollection, el:$('ul.family')})
var workView = new ListView({collection: workCollection, el: $('ul.work')})


//**

var FormView = Backbone.View.extend({

	initialize: function(){
		var friendsCollection = friendsCollection
		var familyCollection = familyCollection
		var workCollection = workCollection 
	},

	events: {
		"click .glyphicon-plus" : "create"
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
			friendsCollection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 1})
		}else if(category == 'Family'){
			familyCollection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 2})
		}else if(category == 'Work'){
			workCollection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 3})
		}else{
			console.log('ERROR')
		}

		this.$el.find('input').val("")

	}

});


var formView = new FormView({el: $('.form')})


$('li.list-group-item').draggable();
$('ul.list-group').droppable({
	drop: function(){
		console.log(this)
	}
})


