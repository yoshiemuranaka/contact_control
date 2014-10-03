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

var ContactCollection = Backbone.Collection.extend({
	model: ContactModel,
	url: '/contacts'
})

///maybe i should set a filter here to only get contacts with particular category id?
var allContacts = new ContactCollection()

//i would like to filter my collection here, but i don't think .where method is working//something like var friendsCollection = new ContactCollection({category_id: 1})

var friends = allContacts.where({category_id: 1})
var friendsCollection = new ContactCollection(friends)
////////////////////////////


var ListView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.collection, 'add', this.addOne)
		this.collection.fetch()
	},

	addOne: function(contact){
		var contactView = new ContactView({model: contact})
		contactView.render();
		this.$el.append(contactView.el)
	}

})

var listView = new ListView({ collection: allContacts, el: $('ul.friends') });



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
		// console.log('to toggle view of contact')
		this.$el.find('.view-details').toggle()
	},

	editContact: function(){
		// console.log('to toggle edit of contact')
		this.$el.find('.edit-details').toggle()
	},

	deleteContact: function(){
		// console.log('to delete contact')
		this.model.destroy()
	},

	updateContact: function(){
		// console.log('update this model info')
		this.model.set('name', this.$el.find('input.nameUpdate').val())
		this.model.save()
	},

	initialize: function(){
		console.log('ContactView Initialized')
		
		//THIS IS WHERE THE CONTACT VIEW WILL AUTOMATICALLY RE-RENDER ITSELF WHEN THE MODEL IS CHANGED

		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "destroy remove", this.remove);
		
		this.render()//this is to render the dom element

		},

	render: function(){
		console.log(this.template)
		this.$el.html( this.template(this.model.attributes) );
	}

})


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

		this.collection.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 1})

		// if (this.$el('input.name').val()== ""){
		// 	alert('missing field')
		// //i am filtering my input here to create new collection instances for the specified collection
		// }else if (category == 'Friends'){
		// 	allContacts.create({name: name, email: email, address: address, phone: phone, picture: picture, category_id: 1})
		// // }else if (category == 'Family')
		// }else{
		// 	console.log('im here')
		// };

	}

});

var formView = new FormView({ el: $('.form'), collection: allContacts})






function addContact(name, age, address, phone_number, picture, category_id, email){

	//CREATING A NEW CONTACT MODEL
	var contactModel = new ContactModel({
		name: name, 
		age: age, 
		address: address, 
		phone_number: phone_number, 
		picture: picture, 
		category_id: category_id, 
		email: email})

	//AJAX CALL TO CREATE CONTACT IN DATABASE
	contactModel.save()

	//CREATING A CONTACT VIEW W/ NEW MODEL
	var contactView = new ContactView ({model: contactModel});
	

	//IF THE CONTACT CAT_ID IS 1, WILL PUSH INTO FRIENDS COLLECTION AND APPEND TO APPROPRIATE UL
	if (contactModel.attributes.category_id == 1){
		friends.create(contactModel)	
		// $('ul.friends').append(contactView.el);
	}else if (contactModel.attributes.category_id == 2){
		frenemies.add(contactModel)
		$('ul.frenemies').append(contactView.el)
	}else{
		console.log('cannot find proper cat_id')
	}

};





