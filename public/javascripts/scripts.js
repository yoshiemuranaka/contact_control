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
		"click .glyphicon-trash" :"deleteContact",
		"click button.update" :"updateContact",
		"click .glyph-address": "showAddressInput",
		"click .glyph-phone": "showPhoneInput",
		"click .glyph-email": "showEmailInput",
		"click .glyph-name": "hideNameInput",
		"dblclick .name": "showNameInput",
		"keydown .addressInput": "updateAddress",
		"keydown .phoneInput": "updatePhone",
		"keydown .emailInput": "updateEmail",
		"keydown .nameInput": "updateName",
		"updateCategory" : 'updateCategory'
	},

	viewContact: function(){
		this.$el.find('.view-details').toggleClass('hide')
	},

	deleteContact: function(){
		this.model.destroy()
	},

	showAddressInput: function(){
		this.$el.find('.address').toggleClass('hide')
		this.$el.find('.addressInput').toggleClass('hide')
	},

	showPhoneInput: function(){
		this.$el.find('.phone').toggleClass('hide')
		this.$el.find('.phoneInput').toggleClass('hide')
	},

	showEmailInput: function(){
		this.$el.find('.email').toggleClass('hide')
		this.$el.find('.emailInput').toggleClass('hide')
	},

	showNameInput: function(){
		this.$el.find('.name').toggleClass('hide')
		this.$el.find('.nameInput').toggleClass('hide')
		this.$el.find('.glyph-name').toggleClass('hide')
	},

	hideNameInput: function(){
		this.$el.find('.name').toggleClass('hide')
		this.$el.find('.nameInput').toggleClass('hide')
		this.$el.find('.glyph-name').toggleClass('hide')
	},

	updateAddress: function(e){
		if(e.keyCode == 13 && this.$el.find('.addressInput').val() != ''){
			var address = this.$el.find('.addressInput').val()
			this.model.set({address: address})
			this.model.save()
		}
	},

	updatePhone: function(e){
		if(e.keyCode == 13 && this.$el.find('.phoneInput').val() != ''){
			var phone_number = this.$el.find('.phoneInput').val()
			this.model.set({phone_number: phone_number})
			this.model.save()
		}
	},

	updateEmail: function(e){
		if(e.keyCode == 13 && this.$el.find('.emailInput').val() != ''){
			var email = this.$el.find('.emailInput').val()
			this.model.set({email: email})
			this.model.save()
		}
	},

	updateName: function(e){
		if(e.keyCode == 13 && this.$el.find('.nameInput').val() != ''){
			var name = this.$el.find('.nameInput').val()
			this.model.set({name: name})
			this.model.save()
		}
	},

	updateCategory: function(event, param){

		var newCatID = parseInt(param)
		this.model.set({category_id: newCatID})
		this.model.save()

	},

	initialize: function(){

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
		var category = this.$el.find('select.category').val();
 	

		if (name == "" || email == ""){
			alert('missing field')
		}else if(category == 'Friends'){
			contactsCollection.create({name: name, email: email, address: address, phone_number: phone, category_id: 1})
		}else if(category == 'Family'){
			contactsCollection.create({name: name, email: email, address: address, phone_number: phone, category_id: 2})
		}else if(category == 'Work'){
			contactsCollection.create({name: name, email: email, address: address, phone_number: phone, category_id: 3})
		}else{
			console.log('ERROR')
		}

		this.$el.find('input').val("")

	}

});


//JQUERY SORTABLE TO TRIGGER MODEL FUNCTION----

	$('.friends, .family, .work').sortable({
		connectWith: '.list-group'
	}).disableSelection()

	$('.list-group').on('sortreceive', function( event, ui ){
		var newCat = event.target.id
		ui.item.trigger('updateCategory',[newCat])
	})



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

