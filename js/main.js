var cssinterval = -1;
var endinterval = -1;
var intervalshake = -1;

var credits = document.getElementById("credits");
var cuisine_petitdejeuner = document.getElementById("cuisine_petitdejeuner");
var global_papier = document.getElementById("global_papier");
var global_passe = document.getElementById("global_passe");
var global_pleure = document.getElementById("global_pleure");
var global_present = document.getElementById("global_present");
var switch_pieces = document.getElementById("switch_pieces");
var veranda_passe = document.getElementById("veranda_passe_audio");
var chambre_passe = document.getElementById("chambre_passe_audio");
var switch_pas = document.getElementById("switch_pas");

var fadeintervals = [];

function clearAllIntervals() {
	for (var i = 1; i < 500; i++) {
		if (i != timeoutfade && i != timeoutimage && i != timeoutvisible && i != cssinterval && i != timeoutoutfront && i != endinterval && !fadeintervals.includes(i)) {
      window.clearInterval(i);
    }
  }
}

function cssChange() {
	    var target = document.getElementById('image-360-1');
    	var material = target.getAttribute('material');
    	if (material != null) { 
    		material.opacity = getComputedStyle(target).opacity;
    		target.setAttribute('material', material);
    	}

    	target = document.getElementById('image-360-2');
    	material = target.getAttribute('material');
    	if (material != null) { 
    		material.opacity = getComputedStyle(target).opacity;
    		target.setAttribute('material', material);
    	}

    	target = document.getElementById('image-360-3');
    	material = target.getAttribute('material');
    	if (material != null) { 
    		material.opacity = getComputedStyle(target).opacity;
    		target.setAttribute('material', material);
    	}

    	target = document.getElementById('image-360-4');
    	material = target.getAttribute('material');
    	if (material != null) { 
    		material.opacity = getComputedStyle(target).opacity;
    		target.setAttribute('material', material);
    	}
}

document.addEventListener('DOMContentLoaded', function() {
  cssinterval = window.setInterval(cssChange, 20);
});

function init() {
  var voltarget = 1;
  credits = document.getElementById("credits");
  cuisine_petitdejeuner = document.getElementById("cuisine_petitdejeuner");
  global_papier = document.getElementById("global_papier");
  global_passe = document.getElementById("global_passe");
  global_pleure = document.getElementById("global_pleure");
  global_present = document.getElementById("global_present");
  switch_pieces = document.getElementById("switch_pieces");
  veranda_passe = document.getElementById("veranda_passe_audio");
  chambre_passe = document.getElementById("chambre_passe_audio");
  switch_pas = document.getElementById("switch_pas");

  veranda_passe.volume = 0;
  chambre_passe.volume = 0;

  global_passe.volume = 0;
  global_passe.muted = false; 
  global_passe.play();

  global_present.muted = false; 
  global_present.volume = 0;
  global_present.play();
  var fadeinterval;
  fadeintervals.push(fadeinterval = setInterval(function () {
    // Only fade if past the fade out point or not at zero already
    if (global_present.volume < voltarget) {
        global_present.volume += 0.1;
        global_present.volume = Math.round(global_present.volume * 10) / 10;
    }

    // When volume at zero stop all the intervalling
    if (global_present.volume == voltarget) {
        clearInterval(fadeinterval);
        fadeintervals.pop(fadeinterval);
    }
  }, 150));
};

function fade_out_audio(audio, voltarget) {
  if (audio.paused) {
    audio.play();
  }
  var fadeinterval;
  fadeintervals.push(fadeinterval = setInterval(function () {
    // Only fade if past the fade out point or not at zero already
    if (audio.volume < voltarget) {
        audio.volume += 0.1;
        audio.volume = Math.round(audio.volume * 10) / 10;
    }
    if (audio.volume > voltarget) {
      audio.volume -= 0.1;
      audio.volume = Math.round(audio.volume * 10) / 10;
    }
    // When volume at zero stop all the intervalling
    if (audio.volume == voltarget) {
        clearInterval(fadeinterval);
        fadeintervals.pop(fadeinterval);
    }
  }, 150));
}


$(function() {
	$("#included_dialogue").load("dialogue/dialogue.html");
  window.setTimeout(function() {
    M1_Text();
  }, 500);
});

function getTarget(data, i) {
	switch(i) {
	    case 1:
	        return data.target1;
	        break;
	    case 2:
	        return data.target2;
	        break;
	    case 3:
	        return data.target3;
	        break;
	    case 4:
	        return data.target4;
	        break;
	    case 5:
	        return data.target5;
	        break;
	}
};

function globalpapier(dur) {
  setTimeout(function() {
    global_papier.volume = 1;
    global_papier.play();  
  }, dur)
};

function soundswitch() {
  switch_pieces.volume = 1;
  switch_pieces.play();
};

function soundswitchpas() {
  switch_pas.volume = 1;
  switch_pas.play();
};

$(function() {
  window.setTimeout(function() {
    document.body.style.backgroundColor = "white";
    document.body.className += " endworld";
  }, 150000);
  window.setTimeout(function() {
    fade_out_audio(cuisine_petitdejeuner, 0);
    fade_out_audio(veranda_passe, 0);
    fade_out_audio(chambre_passe, 0);

    var creditsfond = document.createElement("img");
    creditsfond.setAttribute('id', 'creditsfond');
    creditsfond.setAttribute('src', 'img/Fond_Credits.jpg');
    document.body.appendChild(creditsfond);

    var creditsend = document.createElement("video");
    creditsend.setAttribute('autoplay', true);
    creditsend.removeAttribute('controls');
    creditsend.setAttribute('id', 'creditsend');
    creditsend.setAttribute('src', 'video/credits.mp4');
    document.body.appendChild(creditsend);
    document.body.className = "a-body endworldreverse";
    $("#leave").css("display", "none")
  }, 190000);
  window.setTimeout(function() {
    intervalshake = window.setInterval( function() {
      var className = document.getElementById("shake").className;
      if ($(actualsceneselector).attr('id').includes("present") && !className.includes("shake1")) {
        document.getElementById("shake").className = "shake1";
      } else if (!$(actualsceneselector).attr('id').includes("present")) {
        document.getElementById("shake").className = "";
      }
    }, 400);
  }, 140000);
  window.setTimeout(function() {
    window.clearInterval(intervalshake);
    document.getElementById("shake").className = "";
    window.setInterval( function() {
      var className = document.getElementById("shake").className;
      if ($(actualsceneselector).attr('id').includes("present") && !className.includes("shake3")) {
        document.getElementById("shake").className = "shake3";
      } else if (!$(actualsceneselector).attr('id').includes("present")) {
         document.getElementById("shake").className = "";
      }
    }, 400);
  }, 160000);
});

