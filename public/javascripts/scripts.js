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
	
	initialize: function(){
		console.log("contact collection Initialized")
	}

})

var contactsCollection = new ContactCollection()


//**VIEWS**----------------------------------------------

var ContactView = Backbone.View.extend({
	
	tagName: "li",

	attributes: {
		class: "list-group-item contact-view"
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
		var phone_number = this.$el.find('input.phoneUpdate').val()
		var email = this.$el.find('input.emailUpdate').val()
		var picture = this.$el.find('input.pictureUpdate').val()
		var category_id = this.$el.find('select.categoryUpdate').val()

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

		if(phone_number != ""){
			this.model.set({
			phone_number: phone_number
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

		if(category_id == 'Friends'){
			this.model.set({
				category_id: 1
			})
		};

		if(category_id == 'Family'){
			this.model.set({
				category_id: 2
			})
		};

		if(category_id == 'Work'){
			this.model.set({
				category_id: 3
			})
		}

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
		this.category_id = this.attributes.category_id

		this.listenTo(this.collection, 'all', this.render)
		this.collection.fetch()

	},

	render: function(){
		var self = this
		this.$el.empty()

		_.each(this.collection.models, function(contact){
			
			if (contact.attributes.category_id == self.category_id){
				var contactView = new ContactView({model: contact})
				contactView.render();
				self.$el.append( contactView.el )
			}
		
		})
	
	},

})


// var friendsView = new ListView({collection: contactsCollection, el: $('ul.friends'), attributes: {category_id: 1}})
// var familyView = new ListView({collection: contactsCollection, el:$('ul.family'), attributes: {category_id: 2}})
// var workView = new ListView({collection: contactsCollection, el: $('ul.work'), attributes: {category_id: 3}})

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
			contactsCollection.create({name: name, email: email, address: address, phone_number: phone, picture: picture, category_id: 1})
		}else if(category == 'Family'){
			contactsCollection.create({name: name, email: email, address: address, phone_number: phone, picture: picture, category_id: 2})
		}else if(category == 'Work'){
			contactsCollection.create({name: name, email: email, address: address, phone_number: phone, picture: picture, category_id: 3})
		}else{
			console.log('ERROR')
		}

		this.$el.find('input').val("")

	}

});


// var formView = new FormView({el: $('.form')})

//TRYING TO MAKE DRAG AND DROP WORK 

// $('li.contact-view').sortable()

	$('ul.list-group').sortable({
		connectWith: 'ul.list-group'
	}).disableSelection()

	$('ul.friends').droppable({
		drop: function( event, ui ){
			console.log(ui)//this is my list-item i just dropped
			// console.log($(this).models)
			// console.log(event.target)
		}
	})

// $('ul.friends, ul.family, ul.work').sortable({
// 	connectWith: 'ul.list-group'
// }).disableSelection()


// $('ul.list-group').on('sortupdate', function(event, ui) {

// 	console.log(ui.item)

// })
// $('li.contact-view').on('dragover', function(event){
// 	event.preventDefault();
// 	event.stopPropagation();
// 	$(this).addClass('dragging')
// })

// $('li.contact-view').on('dragleave', function(event){
// 	event.preventDefault()
// 	event.stopPropagation()
// 	$(this).removeClass('dragging')
// })

// $('li.contact-view').on('drop', function(event){
// 	event.preventDefault()
// 	event.stopPropagation()
// 	alert('dropped!')
// })

// $('ul.list-group').sortable({
// 	connectWith: "ul",
// })

// $('ul.list-group').on('collectionUpdate', function(){
// 	console.log('updated')
// })

// $('ul.friends').on('drop', function(e){
// 	console.log(e)
// })

// $('li.list-group-item').click(function(){
// 	$('ul.list-group').trigger('collectionUpdate')
// })
 

///ROUTER ------------------------------

var AppRouter = Backbone.Router.extend({
routes: {
	"": "index",
	}, 
})

var router = new AppRouter();

router.on("route:index", function(){
	
	var friendsView = new ListView({collection: contactsCollection, el: $('ul.friends'), attributes: {category_id: 1}})
	var familyView = new ListView({collection: contactsCollection, el:$('ul.family'), attributes: {category_id: 2}})
	var workView = new ListView({collection: contactsCollection, el: $('ul.work'), attributes: {category_id: 3}})

	var formView = new FormView({el: $('.form')})

})

Backbone.history.start()


//--------------------

/// drag and drop to switch categories
/// update input on double click to show input field
