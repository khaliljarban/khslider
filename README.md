khslider
========

js slider with responsive and css3 support


settings :
sliderDuration= time between each move (ms)
isMobile= boolean
sliderSpeed= the speed of the slider (ms), will affect just when you set the slider to mobile support
isResponsive= boolean
isRtl= boolean: true= rtl , false, ltr (currently it working fine just with the ltr
isAuto= boolean
sliderType= twodirections:more to left and move the right ,(currently just this type the slider is support
controllerType= nextprev:next & prev ,false: without any controller, points:points contrller
isMobile=boolean



load js&css:
<!-- put this on the head -->
<link rel="stylesheet" type="text/css" media="all" href="css/reset.css" />
<link rel="stylesheet" type="text/css" media="all" href="css/style.css" />
<script type='text/javascript' src='js/jquery.js'></script>
<script type='text/javascript' src='js/js.js'></script>
<!-- put this on the head -->



to load the slider needed first to use this structure of html:
and change the images to youre
<!-- html code -->
<div id="sliderloader"  class="slider_outer relative  fll">
	<ul class="fll">
		<li data-title="Day on the desert" data-subtitle="Discover the desert" class="fll relative">
			<img src="images/img01.jpg" />
		</li>	
		<li data-title="Day on the desert" data-subtitle="Discover the desert" class="fll relative">
			<img src="images/img02.jpg" />
		</li>	
		<li data-title="Day on the desert" data-subtitle="Discover the desert" class="fll relative">
			<img src="images/img03.jpg" />
		</li>	
		<li data-title="Day on the desert" data-subtitle="Discover the desert" class="fll relative">
			<img src="images/img04.jpg" />
		</li>	 
	</ul>
</div>
<!-- html code -->


load the slider :
jQuery('#sliderloader').loadkhSlider();

example for change the default settings :
var settings={isResponsive:false,
				sliderDuration:5000
			};
jQuery('#sliderloader').loadkhSlider(settings);


