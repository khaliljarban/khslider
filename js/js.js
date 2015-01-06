/*
 * KH SLIDER
 * develope by:khalil jarban
 * ver 2.2
 * outsource js plugins i used :
 * 								jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 */
(function($) {
    $.fn.loadkhSlider = function(options) {
    	var khslider=new khSlider(options,$(this));
    	 // save all images data to array
    	khslider.loadImages();
    	//lod the function that add data-ind to the elements
    	khslider.doIndexes();
    	//lod match the slider to the 
    	khslider.doIndexes()
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
				  sliderDuration:3000, // (ms) time between every movement
				  sliderSpeed:1000,//slider speed by ms
				  isResponsive:true,//bool
				  isRtl:false,//bool=> true= rtl , false=ltr
				  isAuto:true, //bool=> is auto slider
				  sliderType:'onedirection', //onedirection=continues animation by one direction movement, twodirections=012321023, skiptofirst=012301230123 , 
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
		        	
		        	
		        	if(!self.settings.isMobile){
		        		if(self.settings.sliderType=='onedirection')
		        			self.currentElement.find('ul').stop().animate(directObj,1000,'easeOutQuad',function(){
		        				self.currentElement.find('ul').css({'right':0});
				    			var html=self.currentElement.find('ul').find('li:first').clone();
				    			self.currentElement.find('ul').find('li:first').remove();
				    			self.currentElement.find('ul').append(html);
				    			self.currentSlider=index;
				    		},index);
		        		else{
		        			self.currentElement.find('ul').css(directObj);
		        			self.currentSlider=index;
		        		}
		        	}else{
		        		if(self.settings.sliderType=='onedirection')
		        			self.currentElement.find('ul').stop().animate(directObj,1000,'easeOutQuad',function(){
		        				self.currentElement.find('ul').css({'right':0});
				    			var html=self.currentElement.find('ul').find('li:first').clone();
				    			self.currentElement.find('ul').find('li:first').remove();
				    			self.currentElement.find('ul').append(html);
				    			self.currentSlider=index;
				    		},index);
		        		else{
		        			self.currentElement.find('ul').stop().animate(directObj,self.settings.sliderSpeed);
		        		
		        		}
		        	}
		        	
		        	

		        	
		        	
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
				        		self.doTwodirection();
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





/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});