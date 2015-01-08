/*
 * KH SLIDER
 * develope by:khalil jarban
 * ver 2.3
 * publish date 8.1.2015
 * 444802@gmail.com
 */
(function($) {
    $.fn.loadkhSlider = function(options) {
    	var khslider=new khSlider(options,$(this));
    	 // save all images data to array
    	khslider.loadImages();
    	//lod the function that add data-ind to the elements
    	khslider.doIndexes()
    	//do titles
    	khslider.doTitles();
        // if the slider work with controllers load it
        khslider.loadController();
	    // do the controllers current status
    	khslider.doControllerStatus();
	    // load thumbs
    	khslider.getThumbs();
        //if set responsive do it
        if(khslider.settings.isResponsive)
        	$(window).resize(khslider.doResize);
        //if is automate slider do it
        if(khslider.settings.isAuto)
        	khslider.preAutoslider();	
        if(khslider.settings.isRtl)
        	khslider.doRtl();
    }
    
    // object start 
    function khSlider(options,selector){
    	var self=this;
    	var defaults  = {
				  sliderDuration:2000, // (ms) time between every movement
				  sliderSpeed:1000,//slider speed by ms
				  isResponsive:true,//bool
				  isRtl:false,//bool=> true= rtl , false=ltr
				  isAuto:true, //bool=> is auto slider
				  sliderType:'twodirections', // twodirections=012321023, skiptofirst=012301230123
				  isTitles:true,//bool=> true=show titles, false=hide 
				  issubTitles:true,//bool=> true=show sub titles, false=hide 
				  controllerType:'nextprev',// nextprev=next & prev ,false= without any controller, points=points contrller
				  isMobile:false,//bool=> true= load support animated for mobile
				  isThumbs:false,
			  };
    	self.sliderHeight=600,// (int) the default width of the slider
    	self.currentDirection='left';
    	self.currentSlider=0;
    	self.sliderLastMoved=new Date().getTime(),
    	self.sliderImages=[];
    	self.minImageheight=99999999999999;
    	self.settings= $.extend( {}, defaults, options ); 
    	self.currentElement=selector;
    	//set sliders count
    	self.slidersCount=self.currentElement.find('ul').find('li').length;
    	// set the slider width
    	self.sliderWidth=self.currentElement.width();
    	//set the width of the li
    	self.currentElement.find('ul').find('li').width(self.sliderWidth);
    	// if titles allowed do it
    	self.doTitles=function(){
    								if(!self.settings.isTitles) return false;
    								
    								self.currentElement.find('ul').find('li').each(function(){
    									
    										var elmTitle=$(this).data('title');
    										if(typeof elmTitle!='undefined'){
    											$(this).addClass('title_allowed');
    											var html='';
    											html+='<div class="title_outer">';
    												html+='<div class="title_inner">'+elmTitle+'</div>';
    											html+='</div>';
    											$(this).append(html);
    										}
    											
    								});
    								
    								if(!self.settings.issubTitles) return false;
    								
    								self.currentElement.find('ul').find('li').each(function(){
    									
										var elmTitle=$(this).data('subtitle');
										if(typeof elmTitle!='undefined'){
											$(this).addClass('subtitle_allowed');
											var html='';
											html+='<div class="subtitle_outer">';
												html+='<div class="subtitle_inner">'+elmTitle+'</div>';
											html+='</div>';
											$(this).append(html);
										}
											
								});
    								
    								
    							}
    	//save all images to array
    	self.loadImages= function(){
								                var ind=0;
								                var imga=[];
								                self.currentElement.find('ul').find('li').each(function(){
									                	var imgObj=[];
									                	imgObj['src']=$(this).find('img').attr('src');
									                	var imgTitle=$(this).find('img').attr('title');
									                	if(typeof imgTitle=='undefined')
									                		imgTitle='';
									                	imgObj['title']=imgTitle;
									                	var imgAlt=$(this).find('img').attr('alt');
									                	if(typeof imgAlt=='undefined')
									                		imgAlt='';
									                	imgObj['alt']=imgAlt;
									                	imga[ind]=imgObj;
									                	ind++;
								                });
								                self.sliderImages=imga;
									}
    	//add data-ind to the all elements
    	self.doIndexes= function(){
							       	for(var i=0;i<self.slidersCount;i++)
							       		self.currentElement.find('li').eq(i).attr('data-ind',i);
							       }
    	//load the controllers
    	self.loadController=function(){
							  		if(self.settings.controllerType==false) return false; 
							      	switch(self.settings.controllerType){
							      		case 'nextprev':
							      			this.get_nextprevController();
							      		break;
							      		case 'points':
							      			this.get_pointsController();
							      		break;
							      	}
							      }
    	//append the html of next & prev controller
    	self.get_nextprevController=function(){
											var html='';
											html='<div class="slider_controller">';
													html+='<small class="slider_arrows slider_prev">prev</small>';
													html+='<small class="slider_arrows slider_next">next</small>';
											html+'</div>';
											self.currentElement.append(html);
											$('.slider_next').click(function(){
												
												if(self.settings.sliderType=='skiptofirst')
													self.doSkiptofirst();
												else
													self.gotoTheNext();
												self.sliderLastMoved=new Date().getTime();
											});
											$('.slider_prev').click(function(){
												self.gotoThePrev();
												self.sliderLastMoved=new Date().getTime();
											});
										}
		//when get the last one go to the first
    	self.doSkiptofirst= function(){
										    	var thenext=self.whoisnext();
										    	if(thenext!=-1)
										    		self.gotoIndext(thenext);
										    	else
										    		self.gotoIndext(0);
										    }
    	//find the next index
    	self.whoisnext= function(){
		        	var tmp=self.currentSlider+1;
		        	if(tmp<self.slidersCount){
		        		return tmp;
		        	}else{
		        		return -1;
		        	}
		        }
		//animate to the called index
    	self.gotoIndext=function(index){
		        	var directObj={'left':(-1*index*self.sliderWidth)+'px'};
		        	if(self.settings.isRtl)
		        		directObj={'right':(-1*index*self.sliderWidth)+'px'};
		        	if(!self.settings.isMobile)
		        		self.currentElement.find('ul').css(directObj);
		        	else
		        		self.currentElement.find('ul').stop().animate(directObj,self.settings.sliderSpeed);
		        	self.currentSlider=index;
		        	self.doControllerStatus();
		        }		        
    	//change status of the controllers who is the current and more
    	self.doControllerStatus=function (){
										    		if(self.settings.controllerType==false) return false; 
										    		switch(self.settings.controllerType){
											    		case 'nextprev':
											    			self.donextprevStatus();
											    		break;
											    		case 'points':
											    			self.dopointsStatus();
											    		break;
											    	}
										    		if(self.settings.isThumbs){
										    			self.dothumbsStatus();
										    		}
										    		
										    		
										    		if(self.settings.isTitles){
										    			self.dotitlesStatus();
										    		}
										    			
										    		
										    		
										    	}
    	//change the status of the title
    	self.dotitlesStatus=function(){
    										if($('.title_outer').length>0){
    											$('.title_outer.active').removeClass('active');
    											self.currentElement.find('ul').find('li[data-ind="'+self.currentSlider+'"]').find('.title_outer').addClass('active');
    										}
    										if($('.subtitle_outer').length>0){
    											$('.subtitle_outer.active').removeClass('active');
    											self.currentElement.find('ul').find('li[data-ind="'+self.currentSlider+'"]').find('.subtitle_outer').addClass('active');
    										}
    	
    									}
    	
    	
		//do next & prev status inactive css
    	self.donextprevStatus=function (){
										    		if(self.currentSlider>0)
														$('.slider_prev').removeClass('inactive');
													else
														$('.slider_prev').addClass('inactive');
										    		
										    		if(this.currentSlider+1<this.slidersCount)
														$('.slider_next').removeClass('inactive');
													else
														$('.slider_next').addClass('inactive');
										    	}        
		//change the points status
    	self.dopointsStatus=function (){
										    		$('.slider_point.current').removeClass('current');
													$('.slider_point[data-ind="'+self.currentSlider+'"]').addClass('current');
										    	}
		//do thumb status if there is a thumbs
    	self.dothumbsStatus=function (){
										    		$('.slider_thumb.current').removeClass('current');
													$('.slider_thumb[data-ind="'+self.currentSlider+'"]').addClass('current');
										    	}  
		//go to the previus index
    	self.gotoThePrev=function (){
								        	var theprev=self.whoisprev();
								        	if(theprev!=-1)
								        		self.gotoIndext(theprev);
								        	else
								        		self.currentDirection='left';
								        }
		// setInterval function
    	self.preAutoslider= function(){  setInterval(self.doAutoslider,self.settings.sliderDuration);  }

		//actions to do when resize is called
    	self.doResize=function(){
							    // get the slider container width
					    		self.sliderWidth=self.currentElement.width(); 
					    		self.sliderHeight=self.currentElement.height(); 
							    // parse width
					    		self.currentElement.find('ul').find('li').width(self.sliderWidth);
					    		self.currentElement.find('ul').find('li').find('img').width(self.sliderWidth);
				       			//move the slider to the first one
				    		   	self.gotoIndext(0);
				       			return true;
		    	}
		//automate the right type of the slider 
    	self.doAutoslider=function(){
		        	if(self.sliderLastMoved+self.settings.sliderDuration+1000<new Date().getTime()){
			        	switch (self.settings.sliderType){
				        	case 'twodirections':
				        		self.doTwodirection();
				        	break;
				        	case 'skiptofirst':
				        		self.doSkiptofirst();
				        	break;
			        	}
		        	}
		        }
 
    	//animate by the current direction
    	self.doTwodirection= function (){
									        	if(self.currentDirection=='left')
									        		self.gotoTheNext();
									        	else
									        		self.gotoThePrev();
									        }
		//add rtl classes
    	self.doRtl=   function (){
    		self.currentElement.find('ul').addClass('flr');
    		self.currentElement.find('ul').find('li').addClass('flr');
							        	if(self.settings.controllerType!=false){
							        		self.currentElement.find('.slider_controller').addClass('flr');
							        		self.currentElement.find('.slider_controller').find('.slider_arrows').addClass('flr');
							        	}
							        }
		//go to the next element
    	self.gotoTheNext=  function(){
								        	var thenext=self.whoisnext();
								        	if(thenext!=-1)
								        		self.gotoIndext(thenext);
								        	else
								        		self.currentDirection='right';
								        }
		//find the previus index
    	self.whoisprev= function(){
								        	var tmp=self.currentSlider-1;
								        	if(tmp>=0){
								        		return tmp;
								        	}else{
								        		return -1;
								        	}
								        }  
 
		 //load the images thumbs if it set
    	self.getThumbs=function (){
								    		if(self.settings.isThumbs==false) return false;
								    		if(self.sliderImages.length==0) return false;
								    		var html='';
								    		html='<div class="slider_thumbs">';
								    			for(var i=0;i<self.sliderImages.length;i++){
								    				if(typeof self.sliderImages[i]!='undefined' &&
								    						typeof self.sliderImages[i].src!='undefined'
								    					){
									    				if(i==0)
									    					html+='<img data-ind="'+i+'" alt="'+self.sliderImages[i].alt+'" title="'+self.sliderImages[i].title+'" src="'+self.sliderImages[i].src+'" class="slider_thumb current" />';
									    				else
									    					html+='<img data-ind="'+i+'" alt="'+self.sliderImages[i].alt+'" title="'+self.sliderImages[i].title+'" src="'+self.sliderImages[i].src+'" class="slider_thumb " />';
								    				}
								    			}
								    		html+'</div>';
								    		self.currentElement.append(html);
								    		$('.slider_thumb').click(function(){
								    			var target=jQuery(this).data('ind');
								    			self.gotoIndext(target);
								    			self.sliderLastMoved=new Date().getTime();
								    		});
								    	}
		//append the html of points controller
    	self.get_pointsController=function(){
											    		var html='';
											    		html='<div class="slider_controller">';
											    			for(var i=0;i<self.slidersCount;i++)
											    				if(i==0)
											    					html+='<small data-ind="'+i+'" class="slider_point current"></small>';
											    				else
											    					html+='<small data-ind="'+i+'" class="slider_point"></small>';
											    		html+'</div>';
											    		self.currentElement.append(html);
											    		$('.slider_point').click(function(){
											    			var target=$(this).data('ind');
											    			self.gotoIndext(target);
											    			self.sliderLastMoved=new Date().getTime();
											    		});
											    	}		       
    }
}(jQuery));