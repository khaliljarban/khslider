# khslider js & css3 slider 

Basic useful feature list:

 * rtl/ltr support
 * css3
 * responsive
 * more than one type of animation 
 * more than one type of controller 
 
 
 

load the slider:
```javascript
	$(document).ready(function(){
		jQuery('#sliderloader').loadkhSlider();
	});
```

 
 
 settings:
 ```javascript
	 $(document).ready(function(){
	 		var settings={sliderDuration:3000,  //ms=> , time between each animate
						  sliderSpeed:1000, //ms=> speed of slider, note:this option is active on mobile mode
						  isResponsive:true, //bool=> turn on/off the responsive
						  isRtl:false, //bool=> direction of the slider, true=> rtl, false=>ltr
						  isAuto:true,  //bool=> turn on/off auto animation
						  sliderType:'twodirections', // move type=>twodirections=012321023, skiptofirst=012301230123
						  controllerType:'nextprev', // nextprev=next & prev ,false= without any controller, points=points contrller
						  isMobile:false, //bool=> true= load support animated for mobile
						  isThumbs:false,//bool => turn on/off thumbs
						  };
			jQuery('#sliderloader').loadkhSlider(settings);
	 });
 
 ```




 


