jQuery(document).ready(function(){

	jQuery('#sliderloader').loadkhSlider();
});
/*
 * 
 * KH SLIDER
 * propities= css3, responsive, rtl&ltr, two direction movement
 * ver 1.0
 * 
 */
(function($) {
    $.fn.loadkhSlider = function(options) {
    	var currentElement= $(this);
    	var defaults  = {
						  sliderWidth  :805,// (int) the default width of the slider
						  sliderDuration:3000, // (ms) time between every movement
						  sliderSpeed:1000,//slider speed by ms
						  isResponsive:true,
						  isRtl:false,// true= rtl , false=ltr
						  isAuto:true, // is auto slider
						  sliderType:'twodirections', // twodirections=more to left and move the right
						  controllerType:'nextprev',// nextprev=next & prev ,false= without any controller, points=points contrller
						  isMobile:false,// true= load support animated for mobile
						  
						  //// do not need to change
						  slidersCount:0,
						  sliderLastMoved:new Date().getTime(),
						  currentSlider:0,
						  currentDirection:'left'
					  };
    	 var settings = $.extend( {}, defaults, options ); 
    	 
    	 
    	 //set sliders count
    	settings.slidersCount=currentElement.find('ul').find('li').length;
    	
    	// set the slider width
        settings.sliderWidth=currentElement.width();
        
        //set the width of the li
        currentElement.find('ul').find('li').width(settings.sliderWidth);
        
        //lod the function that add data-ind to the elements
        doIndexes();

        // if the slider work with controllers load it
        if(settings.controllerType!=false)
        	loadController();
        
        // do the controllers current status
        doControllerStatus();
        
        //if set responsive do it
        if(settings.isResponsive)
        	$(window).resize(doResize);
        
        //if is automate slider do it
        if(settings.isAuto)
        	preAutoslider();	
        
        /*
         * animate to the called index
         */
        function gotoIndext(index){
        	if(!settings.isMobile)
        		currentElement.find('ul').css({'left':(-1*index*settings.sliderWidth)+'px'});
        	else
        		currentElement.find('ul').stop().animate({'left':(-1*index*settings.sliderWidth)+'px'},settings.sliderSpeed);
        	settings.currentSlider=index;
        	doControllerStatus();
        }
        
        /*
         * setInterval function
         */
        function preAutoslider(){
        	setInterval(doAutoslider,settings.sliderDuration);
        }
        
        /*
         * automate the right type of the slider 
         */
        function doAutoslider(){
        	if(settings.sliderLastMoved+settings.sliderDuration+1000<new Date().getTime()){
	        	switch (settings.sliderType){
		        	case 'twodirections':
		        		doTwodirection();
		        	break;
	        	}
        	}
        }
        
        /*
         * animate by the current direction
         */
        function doTwodirection(){
        	if(settings.currentDirection=='left')
        		gotoTheNext();
        	else
        		gotoThePrev();
        }
        
        /*
         * go to the previus index
         */
        function gotoThePrev(){
        	var theprev=whoisprev();
        	if(theprev!=-1)
        		gotoIndext(theprev);
        	else
        		settings.currentDirection='left';
        }
        
        /*
         * go to the next element
         */
        function gotoTheNext(){
        	var thenext=whoisnext();
        	if(thenext!=-1)
        		gotoIndext(thenext);
        	else
        		settings.currentDirection='right';
        }
        
        /*
         * find the previus index
         */
        function whoisprev(){
        	var tmp=settings.currentSlider-1;
        	if(tmp>=0){
        		return tmp;
        	}else{
        		return -1;
        	}
        }
        
        /*
         * find the next index
         */
        function whoisnext(){
        	var tmp=settings.currentSlider+1;
        	if(tmp<settings.slidersCount){
        		return tmp;
        	}else{
        		return -1;
        	}
        }
        
    	 /*
    	  * add data-ind to the all elements
    	  */ 
        function doIndexes(){
        	for(var i=0;i<settings.slidersCount;i++)
        		currentElement.find('li').eq(i).attr('data-ind',i);
        }
    	   
    	/*
    	* actions to do when resize is called
    	* 
    	*/
    	function doResize(){
    		   	settings.sliderWidth=currentElement.width();
       			currentElement.find('ul').find('li').width(settings.sliderWidth);
       			gotoIndext(0);
       			return true;
    	}
    	
    	/*
    	 * load the controllers
    	 */
    	function loadController(){
        	switch(settings.controllerType){
        		case 'nextprev':
        			get_nextprevController();
        		break;
        		case 'points':
        			get_pointsController();
        		break;
        	}
        }
    	
    	/*
    	 * change status of the controllers who is the current and more
    	 */
    	function doControllerStatus(){
    		switch(settings.controllerType){
	    		case 'nextprev':
	    			donextprevStatus();
	    		break;
	    		case 'points':
	    			dopointsStatus();
	    		break;
	    	}
    	}
    	
    	/*
    	 * append the html of points controller
    	 */
    	function get_pointsController(){
    		var html='';
    		html='<div class="slider_controller">';
    			for(var i=0;i<settings.slidersCount;i++)
    				if(i==0)
    					html+='<small data-ind="'+i+'" class="slider_point current"></small>';
    				else
    					html+='<small data-ind="'+i+'" class="slider_point"></small>';
    		html+'</div>';
    		currentElement.append(html);
    		jQuery('.slider_point').click(function(){
    			var target=jQuery(this).data('ind');
    			gotoIndext(target);
    			settings.sliderLastMoved=new Date().getTime();
    		});
    	}
    	
    	/*
    	 * change the points status
    	 */
    	function dopointsStatus(){
    		jQuery('.slider_point.current').removeClass('current');
			jQuery('.slider_point[data-ind="'+settings.currentSlider+'"]').addClass('current');
    	}
    	
    	/*
    	 * append the html of next & prev controller
    	 */
    	function get_nextprevController(){
    		var html='';
    		html='<div class="slider_controller">';
    				html+='<small class="slider_arrows slider_prev">prev</small>';
    				html+='<small class="slider_arrows slider_next">next</small>';
    		html+'</div>';
    		currentElement.append(html);
    		jQuery('.slider_next').click(function(){
    			gotoTheNext()
    			settings.sliderLastMoved=new Date().getTime();
    		});
    		jQuery('.slider_prev').click(function(){
    			gotoThePrev()
    			settings.sliderLastMoved=new Date().getTime();
    		});
    	}
    	
    	/*
    	 * do next & prev status inactive css
    	 */
    	function donextprevStatus(){
    		if(settings.currentSlider>0)
				jQuery('.slider_prev').removeClass('inactive');
			else
				jQuery('.slider_prev').addClass('inactive');
    		
    		if(settings.currentSlider+1<settings.slidersCount)
				jQuery('.slider_next').removeClass('inactive');
			else
				jQuery('.slider_next').addClass('inactive');
    	}
    }	

      

}(jQuery));