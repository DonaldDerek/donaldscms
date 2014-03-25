'use strict';

require(['config'], function (config) {
    var app = {
        initialize: function () {
        	var app = this;
        	require(['jQuery'], function ($) {
				require(['bootstrap'], function(){
					require(['wysihtml5'], function(){
						$("#wys").wysihtml5();		
					});
				});
				
				
				app.handleMenu();
			});

        },
        handleMenu: function(){
        	var table = $('.projects-block');
        	var add_block = $('.add-new-block');

        	$("#add-new").on('click', function(e){
        		e.preventDefault();
        		table.fadeToggle('fast', function(){
        			add_block.fadeToggle('fast');	
        		});
           		
           		
           	});
        	
        	$("#cancel-form").on('click', function(e){
        		e.preventDefault();
           		add_block.fadeToggle('fast', function(){
        			table.fadeToggle('fast');	
        		});
           	});
        }

    };

    app.initialize();

});


