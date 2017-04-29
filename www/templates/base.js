{% load static %}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-75657337-1', 'auto');
ga('send', 'pageview');

window.twttr = (function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0],
	t = window.twttr || {};
	if (d.getElementById(id)) return t;
	js = d.createElement(s);
	js.id = id;
	js.src = "https://platform.twitter.com/widgets.js";
	fjs.parentNode.insertBefore(js, fjs);

	t._e = [];
	t.ready = function(f) {
		t._e.push(f);
	};

	return t;
}(document, "script", "twitter-wjs"));

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/platform.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

function print0SDF() {
	var pdocument = window.open();
	pdocument.document.write('<img src="{% static 'img/0sdf.png' %}"/>');
	pdocument.document.close();
	pdocument.focus();
	pdocument.print();
	pdocument.close();
}

$( document ).ready(function(){
	$('.dropdown-button').dropdown({
		constrain_width: false
	});
	$('.button-collapse').sideNav();
	$('.tooltipped').tooltip(
	{
		delay: 50,
		html: true
	}
	);
	$('.parallax').parallax();
	$('.scrollspy').scrollSpy();
	$('select').material_select();
	$('.modal').modal();
	$('.collapsible').collapsible();
	$('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 2 // Creates a dropdown of 15 years to control year
            });
	$('.rightmenu').pushpin({
		top: $('nav')[0].clientHeight + 10,
		bottom: $('footer')[0].offsetTop,
		offset: $('nav')[0].clientHeight + 10
	});
	Materialize.updateTextFields();
});